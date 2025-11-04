import { DepartamentoData } from "../data/DepartamentoData";
import { TipoDenunciaData } from "../data/TipoDenunciaData";
import { UsuarioData } from "../data/UsuarioData";
import { Departamento } from "../types/types";

export class DepartamentoBusiness {

    departamentoData = new DepartamentoData();
    usuarioData = new UsuarioData();
    tipoDenunciaData = new TipoDenunciaData();

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
    public async pegarDepartamentoPorNome(nome: string): Promise<Departamento> {
        try {
            if (!nome) {
                throw new Error("Nome inválido");
            }
            const departamento = await this.departamentoData.pegarDepartamentoPorNome(nome);
            if (!departamento) {
                throw new Error("Departamento não encontrado");
            }
            return departamento;
        } catch (error: any) {
            throw new Error(error.message || "Erro inesperado ao buscar departamento");
        }
    }
    public async criarDepartamento(nome: string, endereco: string, horario_funcionamento: string, gerente_id: Number): Promise<Number> {
        try {
            // (Assumindo que UsuarioData tem 'pegarUsuarioPeloIdNoBD' como corrigimos)
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
    public async atualizarDepartamento(id: Number, nome: string, endereco: string, horario_funcionamento: string, gerente_id: Number): Promise<void> {
        try {
            if (!id || typeof id !== "number" || isNaN(Number(id))) {
                throw new Error("ID inválido");
            }
            const deptoExiste = await this.departamentoData.pegarDepartamentoPorId(id);
            if (!deptoExiste) {
                throw new Error("Departamento não encontrado");
            }
            const gerente = await this.usuarioData.pegarUsuarioPeloIdNoBD(gerente_id);
            if (!gerente) {
                throw new Error("ID de gerente não encontrado");
            }
            if (gerente.papel !== 'funcionario') {
                throw new Error("Gerente selecionado não tem o papel 'funcionario'");
            }
            const nomeExistente = await this.departamentoData.pegarDepartamentoPorNome(nome);
            if (nomeExistente && nomeExistente.id !== id) {
                throw new Error("Departamento com este nome já existe");
            }

            await this.departamentoData.atualizarDepartamento(id, nome, endereco, horario_funcionamento, gerente_id);

        } catch (error: any) {
            throw new Error(error.message || "Erro inesperado ao atualizar departamento");
        }
    }
    public async deletarDepartamento(id: Number): Promise<void> {
        try {
            if (!id || typeof id !== "number" || isNaN(Number(id))) {
                throw new Error("ID inválido");
            }
            const deptoExiste = await this.departamentoData.pegarDepartamentoPorId(id);
            if (!deptoExiste) {
                throw new Error("Departamento não encontrado");
            }
            const tiposVinculados = await this.tipoDenunciaData.pegarTiposPorDepartamentoId(id);
            if (tiposVinculados && tiposVinculados.length > 0) {
                throw new Error("Não é possível deletar. Este departamento está sendo usado por Tipos de Denúncia.");
            }

            await this.departamentoData.deletarDepartamento(id);
        } catch (error: any) {
            throw new Error(error.message || "Erro inesperado ao deletar departamento");
        }
    }
}