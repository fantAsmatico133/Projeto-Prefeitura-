import { connection } from "../dbConnection";
import { Tipo_Denuncia } from "../types/types";

export class TipoDenunciaData {
    async pegarTiposPorDepartamentoId(departamento_id: Number): Promise<Tipo_Denuncia[]> {
        try {
            const tipos = await connection('tipo_denuncia')
                .where({ departamento_id: departamento_id });
            return tipos;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}