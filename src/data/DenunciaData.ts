import { connection } from "../dbConnection";

export class DenunciaData {
    async pegarDenuncias() {
        try {
            const denuncias = await connection('denuncias').select();
            return denuncias;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async contarTotalDenuncias() {
        const result = await connection('denuncias').count('* as total');
        return result[0].total;
    }

    async contarPorStatus() {
        const result = await connection('denuncias')
            .select('status')
            .count('* as contagem')
            .groupBy('status');
        return result;
    }

    async contarPorDepartamento() {
        // join com tipo_denuncia e departamento
        const result = await connection('denuncias')
            .join('tipo_denuncia', 'denuncias.tipo_denuncia_id', 'tipo_denuncia.id')
            .join('departamentos', 'tipo_denuncia.departamento_id', 'departamentos.id')
            .select('departamentos.nome as nome_departamento')
            .count('denuncias.id as contagem')
            .groupBy('departamentos.nome');
        return result;
    }

}