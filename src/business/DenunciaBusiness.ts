import { DenunciaData } from "../data/DenunciaData";
import { Denuncia, StatusDenuncia } from "../types/types";

export class DenunciaBusiness {
    denunciaData = new DenunciaData();

    
    private calcularPrioridade(denuncia: any): number {
        const text = ((denuncia.titulo || "") + " " + (denuncia.descricao || "")).toLowerCase();
        const nivel3 = ["acidente elétrico", "acidente eletrico", "choque elétrico", "choque eletrico", "eletric", "incêndio", "incendio", "fogo", "explosão", "explosao", "vítima", "vitima"];
        const nivel2 = ["queda de energia", "apagão", "apagao", "queda energia", "vazamento", "alagamento", "desabamento"];
        const nivel1 = ["lixo", "entulho", "lixo na calçada", "lixo na calcada", "calçada suja", "calçada suja", "poda de árvore"];
        for (const k of nivel3) if (text.includes(k)) return 3;
        for (const k of nivel2) if (text.includes(k)) return 2;
        for (const k of nivel1) if (text.includes(k)) return 1;

        return 1;
    }

    public async pegarDenuncias(): Promise<Denuncia[]> {
        try {
            const denuncias = await this.denunciaData.pegarDenuncias();
            const enriched = denuncias.map((d: any) => {
                const prioridade = this.calcularPrioridade(d);
                return { ...d, prioridade } as Denuncia;
            });
            return enriched;
        } catch (error: any) {
            throw new Error("Denúncias não encontradas: " + (error.message || error.sqlMessage));
        }
    }
    
    public async pegarDenunciasOrdenadasPorPrioridade(): Promise<Denuncia[]> {
        const all = await this.pegarDenuncias();
        return all.sort((a, b) => Number((b.prioridade || 0)) - Number((a.prioridade || 0)));
    }

    public async pegarDenunciasAnonimas(): Promise<Partial<Denuncia>[]> {
        const all = await this.pegarDenuncias();
        return all.map(({ usuario_id, ...rest }: any) => {
            return rest as Partial<Denuncia>;
        });
    }

    public async pegarDenunciaPorId(id: number): Promise<Denuncia> {
        try {
            const denuncia = await this.denunciaData.pegarDenunciaPorId(id);
            if (!denuncia) {
                throw new Error("Denúncia não encontrada");
            }
            const prioridade = this.calcularPrioridade(denuncia);
            return { ...denuncia, prioridade } as Denuncia;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async atualizarStatus(id: number, status: string): Promise<void> {
        try {

            const denuncia = await this.denunciaData.pegarDenunciaPorId(id);
            if (!denuncia) {
                throw new Error("Denúncia não encontrada");
            }

            const statusValidos = ['Pendente', 'Em análise', 'Resolvido'];
            if (!statusValidos.includes(status)) {
                throw new Error("Status inválido. Valores permitidos: 'Pendente', 'Em análise', 'Resolvido'");
            }

            await this.denunciaData.atualizarStatus(id, status as StatusDenuncia);

        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}