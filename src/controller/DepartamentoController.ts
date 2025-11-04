import { Response, Request } from "express";
import { DepartamentoBusiness } from "../business/DepartamentoBusiness";
export class DepartamentoController {
    departamentoBusiness = new DepartamentoBusiness();

    
    public pegarDepartamentos = async (req: Request, res: Response) => {
        try {
            const output = await this.departamentoBusiness.pegarDepartamentos();
            res.status(200).send(output);
        } catch (error: any) {
            res.status(500).send(error.message || "Erro inesperado");
        }
    }
    public pegarDepartamentoPorId = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            
            if (isNaN(id)) {
                res.status(400).send("ID deve ser um número");
                return; 
            }

            const output = await this.departamentoBusiness.pegarDepartamentoPorId(id);
            res.status(200).send(output);

        } catch (error: any) {
            
            if (error.message === "Departamento não encontrado") {
                res.status(404).send(error.message);
            } else if (error.message === "ID inválido") {
                res.status(400).send(error.message);
            } else {
                res.status(500).send(error.message || "Erro inesperado");
            }
        }
    }
    public criarDepartamento = async (req: Request, res: Response) => {
        try {
        
            const { nome, endereco, horario_funcionamento, gerente_id } = req.body;

            
            if (!nome || !endereco || !horario_funcionamento || !gerente_id) {
                return res.status(400).send("Entrada inválida. Todos os campos (nome, endereco, horario_funcionamento, gerente_id) são obrigatórios.");
            }

            const output = await this.departamentoBusiness.criarDepartamento(nome, endereco, horario_funcionamento, gerente_id);

            
            res.status(201).send({ message: "Departamento criado com sucesso", id: output });

        } catch (error: any) {
            
            if (error.message.includes("Departamento com este nome já existe")) {
                res.status(409).send(error.message); // 409 Conflict
            } else if (error.message.includes("ID de gerente") || error.message.includes("Gerente deve")) {
                res.status(400).send(error.message); // 400 Bad Request
            } else {
                res.status(500).send(error.message || "Erro inesperado");
            }
        }
    }
}