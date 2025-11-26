import { DenunciaData } from "../data/DenunciaData";
import { Denuncia } from "../types/types";
import { ConfirmacaoData } from "../data/ConfirmacaoData";
import { ComentarioData } from "../data/ComentarioData";
import { UsuarioData } from "../data/UsuarioData";

type EstatisticasDenuncias = {
    total_denuncias: number;
    denuncias_por_status: { status: string; contagem: number }[];
    denuncias_por_departamento: { nome_departamento: string; contagem: number }[];
};

export class DenunciaBusiness {
    private denunciaData: DenunciaData;
    private confirmacaoData: ConfirmacaoData;
    private comentarioData: ComentarioData;
    private usuarioData: UsuarioData;

    constructor(
        denunciaData?: DenunciaData,
        confirmacaoData?: ConfirmacaoData,
        comentarioData?: ComentarioData,
        usuarioData?: UsuarioData
    ) {
        this.denunciaData = denunciaData || new DenunciaData();
        this.confirmacaoData = confirmacaoData || new ConfirmacaoData();
        this.comentarioData = comentarioData || new ComentarioData();
        this.usuarioData = usuarioData || new UsuarioData();
    }
    // Estatísticas agregadas para dashboard
    public async pegarEstatisticas(): Promise<EstatisticasDenuncias> {
        const total = await this.denunciaData.contarTotalDenuncias();
        const porStatus = await this.denunciaData.contarPorStatus();
        const porDepartamento = await this.denunciaData.contarPorDepartamento();
        return {
            total_denuncias: Number(total),
            denuncias_por_status: porStatus.map((r: any) => ({ status: r.status, contagem: Number(r.contagem) })),
            denuncias_por_departamento: porDepartamento.map((r: any) => ({ nome_departamento: r.nome_departamento, contagem: Number(r.contagem) }))
        };
    }

    // calcula prioridade a partir do título/descrição
    private calcularPrioridade(denuncia: any): number {
        const text = ((denuncia.titulo || "") + " " + (denuncia.descricao || "")).toLowerCase();

        // regras simples de palavras-chave -> nível
        const nivel3 = ["acidente elétrico", "acidente eletrico", "choque elétrico", "choque eletrico", "eletric", "incêndio", "incendio", "fogo", "explosão", "explosao", "vítima", "vitima"];
        const nivel2 = ["queda de energia", "apagão", "apagao", "queda energia", "vazamento", "alagamento", "desabamento"];
        const nivel1 = ["lixo", "entulho", "lixo na calçada", "lixo na calcada", "calçada suja", "calçada suja", "poda de árvore"];

        // match arrays
        for (const k of nivel3) if (text.includes(k)) return 3;
        for (const k of nivel2) if (text.includes(k)) return 2;
        for (const k of nivel1) if (text.includes(k)) return 1;

        // default
        return 1;
    }

    public async pegarDenuncias(): Promise<Denuncia[]> {
        try {
            const denuncias = await this.denunciaData.pegarDenuncias();

            // enriquecer com prioridade calculada
            const enriched = denuncias.map((d: any) => {
                const prioridade = this.calcularPrioridade(d);
                return { ...d, prioridade } as Denuncia;
            });

            return enriched;
        } catch (error: any) {
            throw new Error("Denúncias não encontradas: " + (error.message || error.sqlMessage));
        }
    }

    // retorna lista ordenada por prioridade (maior prioridade primeiro)
    public async pegarDenunciasOrdenadasPorPrioridade(): Promise<Denuncia[]> {
        const all = await this.pegarDenuncias();
        return all.sort((a: Denuncia, b: Denuncia) => Number(b.prioridade || 0) - Number(a.prioridade || 0));
    }

    // retorna denúncias sem expor quem denunciou (anonimizadas)
    public async pegarDenunciasAnonimas(): Promise<Partial<Denuncia>[]> {
        const all = await this.pegarDenuncias();
        // remover campos identificadores como usuario_id
        return all.map(({ usuario_id, ...rest }: any) => {
            // também, se houver outros campos sensíveis, remova aqui
            return rest as Partial<Denuncia>;
        });
    }

    // Confirma uma denúncia por um usuário autenticado
    public async confirmarDenuncia(usuarioId: number, denunciaId: number) {
        try {
            // valida existência da denúncia
            const denuncia = await this.denunciaData.pegarDenunciaPorId(denunciaId);
            if (!denuncia) {
                throw new Error('Denúncia não encontrada');
            }

            // verifica se usuário já confirmou
            const jaConfirmou = await this.confirmacaoData.existeConfirmacao(usuarioId, denunciaId);
            if (jaConfirmou) {
                throw new Error('Usuário já confirmou esta denúncia');
            }

            const newId = await this.confirmacaoData.criarConfirmacao(usuarioId, denunciaId);
            const totalConfirmacoes = await this.confirmacaoData.contarConfirmacoesPorDenuncia(denunciaId);

            return { id: newId, denuncia_id: denunciaId, usuario_id: usuarioId, total_confirmacoes: Number(totalConfirmacoes) };
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao confirmar denúncia');
        }
    }

    // Adiciona comentário por usuário autenticado na denúncia
    public async comentarDenuncia(usuarioId: number, denunciaId: number, texto: string) {
        try {
            if (!texto || texto.trim().length === 0) {
                throw new Error('Texto do comentário é obrigatório');
            }

            const denuncia = await this.denunciaData.pegarDenunciaPorId(denunciaId);
            if (!denuncia) {
                throw new Error('Denúncia não encontrada');
            }

            const usuario = await this.usuarioData.pegarUsuarioPeloIdNoBD(usuarioId);
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const tipo_usuario = usuario.papel;

            const newId = await this.comentarioData.criarComentario(texto, usuarioId, denunciaId, tipo_usuario);

            return {
                id: newId,
                texto,
                usuario_id: usuarioId,
                denuncia_id: denunciaId,
                tipo_usuario,
                data: new Date()
            };
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao adicionar comentário');
        }
    }

    // cria denúncia com lógica condicional de usuário (aceita anônimas)
    public async criarDenuncia(denunciaInput: any, usuarioIdFromToken?: number | null) {
        try {
            let usuario_id: number | null = null;
            let anonimo = false;

            if (usuarioIdFromToken && Number(usuarioIdFromToken) > 0) {
                if (denunciaInput.anonimo === true) {
                    usuario_id = null;
                    anonimo = true;
                } else {
                    usuario_id = Number(usuarioIdFromToken);
                    anonimo = false;
                }
            } else {
                usuario_id = null;
                anonimo = true;
            }

            const toInsert = {
                titulo: denunciaInput.titulo,
                descricao: denunciaInput.descricao,
                endereco_denuncia: denunciaInput.endereco_denuncia,
                tipo_denuncia_id: denunciaInput.tipo_denuncia_id,
                status: denunciaInput.status || 'Pendente',
                anonimo,
                usuario_id
            };

            const newId = await this.denunciaData.criarDenuncia(toInsert);

            const prioridade = this.calcularPrioridade(toInsert as any);

            return { id: newId, ...toInsert, prioridade };
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao criar denúncia');
        }
    }
}