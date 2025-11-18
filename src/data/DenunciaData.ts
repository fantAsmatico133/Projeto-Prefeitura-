import { connection } from "../dbConnection";
import { Denuncia, StatusDenuncia } from "../types/types";

export class DenunciaData {
    async pegarDenuncias() {
        try {
            const denuncias = await connection('denuncias').select();
            return denuncias;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    
    //Buscar denúncia específica pelo ID
    async pegarDenunciaPorId(id: number): Promise<Denuncia | undefined> {
        try {
            const denuncia = await connection('denuncias')
                .where({ id: id })
                .first();
            return denuncia;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    //Atualizar apenas o status da denúncia
    async atualizarStatus(id: number, novoStatus: StatusDenuncia): Promise<void> {
        try {
            await connection('denuncias')
                .where({ id: id })
                .update({ status: novoStatus });
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}