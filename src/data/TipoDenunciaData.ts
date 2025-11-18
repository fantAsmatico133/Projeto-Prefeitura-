import { connection } from "../dbConnection";
import { Tipo_Denuncia } from "../types/types";

export class TipoDenunciaData {
    /*async pegarTiposDenunciaId(departamento_id: Number): Promise<Tipo_Denuncia[]> {
        try {
            const tipos = await connection('tipo_denuncia')
                .where({ departamento_id: departamento_id });
            return tipos;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }*/

    async pegarTiposDenuncia(): Promise<Tipo_Denuncia[]> {
        try {
            const tipos = await connection('tipo_denuncia')
                .select('*')
            return tipos;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async TiposDenunciaPorId(id: Number): Promise<Tipo_Denuncia[]> {
        try{
            const tipos = await connection('tipo_denuncia')
            .where({id: id});
            return tipos;
        }catch(error: any){
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async criarTipoDenuncia(nome: string, departamento_id: Number): Promise<Number> {
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
}