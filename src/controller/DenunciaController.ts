// ARQUIVO ATUALIZADO: src/controller/DenunciaController.ts

import { Response, Request } from "express";
import { DenunciaBusiness } from "../business/DenunciaBusiness";

export class DenunciaController{
    denunciaBusiness = new DenunciaBusiness();

    // GET /denuncias (Listar todas)
    public getDenuncia = async (req: Request, res: Response)=>{
        try{
            const users = await this.denunciaBusiness.pegarDenuncias();
            res.status(200).send(users);
        }catch(error:any){
            res.status(500).send({error: error.message});
        }
    }

    // GET /denuncias/anonimas (Listar anônimas)
    public getDenunciasAnonimas = async (req: Request, res: Response) => {
        try{
            const anonimas = await this.denunciaBusiness.pegarDenunciasAnonimas();
            res.status(200).send(anonimas);
        }catch(error:any){
            res.status(500).send({error: error.message});
        }
    }

    // GET /denuncias/fila (Listar por prioridade)
    public getFilaPrioridade = async (req: Request, res: Response) => {
        try {
            const fila = await this.denunciaBusiness.pegarDenunciasOrdenadasPorPrioridade();
            res.status(200).send(fila);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    };

    public getDenunciaPorId = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).send("ID inválido");
                return;
            }
            const denuncia = await this.denunciaBusiness.pegarDenunciaPorId(id);
            res.status(200).send(denuncia);

        } catch (error: any) {
            if (error.message === "Denúncia não encontrada") {
                res.status(404).send(error.message);
            } else {
                res.status(500).send(error.message);
            }
        }
    }
    public atualizarStatus = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;

            if (isNaN(id)) {
                res.status(400).send("ID inválido");
                return;
            }
            if (!status) {
                res.status(400).send("O novo status é obrigatório");
                return;
            }

            await this.denunciaBusiness.atualizarStatus(id, status);
            res.status(200).send({ message: "Status atualizado com sucesso!" });

        } catch (error: any) {
            if (error.message === "Denúncia não encontrada") {
                res.status(404).send(error.message);
            } else if (error.message.includes("Status inválido")) {
                res.status(400).send(error.message);
            } else {
                res.status(500).send(error.message);
            }
        }
    }
}