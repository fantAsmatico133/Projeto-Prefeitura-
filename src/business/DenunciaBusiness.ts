import { DenunciaData } from "../data/DenunciaData";
import { Denuncia } from "../types/types";

export class DenunciaBusiness {
    denunciaData = new DenunciaData();

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
        return all.sort((a, b) => Number((b.prioridade || 0)) - Number((a.prioridade || 0)));
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
}