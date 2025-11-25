import { connection } from "../dbConnection";
import { Tipo_Denuncia } from "../types/types";

export class TipoDenunciaData {
    async pegarTiposDenuncia(): Promise<Tipo_Denuncia[]> {
        try {
            const tipos = await connection('tipo_denuncia')
                .select('*')
            return tipos;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async TiposDenunciaPorId(id: number): Promise<Tipo_Denuncia[]> {
        try {
            const tipos = await connection('tipo_denuncia')
                .where({ id: id });
            return tipos;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async criarTipoDenuncia(nome: string, departamento_id: number): Promise<number> {
        try {
            const criarTipoDenuncia = await connection('tipo_denuncia')
                .insert({
                    nome: nome,
                    departamento_id: departamento_id
                });

            const novoId = criarTipoDenuncia[0];

            return novoId;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async atualizarTipoDenuncia(id: number, nome: string, departamento_id: number): Promise<void> {
        try {
            await connection('tipo_denuncia')
                .where({ id: id })
                .update({
                    nome: nome,
                    departamento_id: departamento_id
                });
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}