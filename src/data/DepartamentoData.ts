import { connection } from "../dbConnection";
import { Departamento } from "../types/types";

export class DepartamentoData {
    async pegarDepartamentoPorNome(nome: string) {
        try {
            const departamento = await connection('departamentos')
                .where({ nome: nome })
                .first();
            return departamento;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    async pegarDepartamentos() {
        try {
            const departamentos = await connection('departamentos').select();
            return departamentos;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    async pegarDepartamentoPorId(id: Number) {
        try {
            const departamento: Departamento = await connection('departamentos')
                .where({ id: id })
                .first();
            return departamento;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    async criarDepartamento(nome: string, endereco: string, horario_funcionamento: string, gerente_id: Number): Promise<Number> {
        try {
            const novoDepto = await connection('departamentos')
                .insert([
                    {
                        nome: nome,
                        endereco: endereco,
                        horario_funcionamento: horario_funcionamento,
                        gerente_id: gerente_id
                    }
                ], ['id']);

            const novoId: number = novoDepto[0].id;
            return novoId;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}