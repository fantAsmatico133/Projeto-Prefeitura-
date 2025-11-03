

import { DepartamentoData } from "../data/DepartamentoData";
import { UsuarioData } from "../data/UsuarioData"; 
import { Departamento } from "../types/types";

export class DepartamentoBusiness { 

    departamentoData = new DepartamentoData();
    usuarioData = new UsuarioData(); 

    
    public async pegarDepartamentos(): Promise<Departamento[]> {
        try {
            const departamentos = await this.departamentoData.pegarDepartamentos();
            return departamentos;
        } catch (error: any) {
            throw new Error(error.message || "Erro inesperado ao buscar departamentos");
        }
    }

    
    public async pegarDepartamentoPorId(id: Number): Promise<Departamento> {
        try {
            
            if (!id || typeof id !== "number" || isNaN(Number(id))) {
                throw new Error("ID inválido"); 
            }

            const departamento = await this.departamentoData.pegarDepartamentoPorId(id);

            
            if (!departamento) {
                throw new Error("Departamento não encontrado"); 
            }

            return departamento;
        } catch (error: any) {
            throw new Error(error.message || "Erro inesperado ao buscar departamento");
        }
    }

    
    public async criarDepartamento(nome: string, endereco: string, horario_funcionamento: string, gerente_id:Number): Promise<Number> {
        try {
            
            const gerente = await this.usuarioData.pegarUsuarioPeloIdNoBD(gerente_id);

            if (!gerente) {
                throw new Error("ID de gerente não encontrado");
            }
            
            if (gerente.papel !== 'funcionario') {
                throw new Error("Gerente selecionado não tem o papel 'funcionario'");
            }

            
            const nomeExistente = await this.departamentoData.pegarDepartamentoPorNome(nome);
            if (nomeExistente) {
                throw new Error("Departamento com este nome já existe");
            }

            
            const novoId = await this.departamentoData.criarDepartamento(nome, endereco, horario_funcionamento, gerente_id);
            return novoId;

        } catch (error: any) {
            throw new Error(error.message || "Erro inesperado ao criar departamento");
        }
    }
}