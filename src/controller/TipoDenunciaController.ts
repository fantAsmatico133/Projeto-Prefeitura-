import { TipoDenunciaBusiness } from "../business/TipoDenunciaBusiness";
import { Tipo_Denuncia } from "../types/types";
import {Request, Response} from "express";

export class TipoDenunciaController{
    tipoDenunciaBusiness = new TipoDenunciaBusiness();
    public pegarTipoDenuncia = async (req: Request, res: Response) => {
        try{
            const pegarTipoDenuncia: Tipo_Denuncia[] = await this.tipoDenunciaBusiness.pegarTipoDenuncia();
            res.status(200).send(pegarTipoDenuncia);
        }catch(error: any){
            res.status(500).send(error.message);
            
        }
    }

    public pegarTipoDenunciaPorId = async (req: Request, res: Response) => {
        try{
            const id = Number(req.params.id);
            if(isNaN(id)){
                res.status(400).send({message: "O id fornecido não um número válido"})
            }
            else{
                const pegarTipoDenunciaPorId: Tipo_Denuncia[] = await this.tipoDenunciaBusiness.pegarTipoDenunciaPorId(id);
                res.status(200).send(pegarTipoDenunciaPorId);
            }
        }catch(error: any){
            if(error.message.includes('Denúncia não encontrada')){
                res.status(404).send(error.message);
            }
            else{
                res.status(500).send(error.message);
            }
        }
    }

   public criarTipoDenuncia = async (req: Request, res: Response) => {
    try{
        const nome = req.body.nome;
        const departamento_id = Number( req.body.departamento_id);

        if(!nome || !departamento_id || departamento_id === undefined) {
            return res.status(400).send({ message: "Nome e ID do departamento são obrigatórios." });
        }
        
        if(isNaN(departamento_id)){
            return res.status(400).send({ message: 'O ID de departamento fornecido não é um número válido.' });
        }else{
            const criarTipoDenuncia = await this.tipoDenunciaBusiness.criarTipoDenuncia(nome, departamento_id);
            const resultado = criarTipoDenuncia;
            res.status(201).send({ID: resultado});
        }
        
    

        
    } catch(error: any){
        
        console.error("Erro no Controller (criarTipoDenuncia):", error.message); 

        if(error.message.includes("Tipo Denúncia já existente")){
            return res.status(409).send({ message: error.message });
        }else{
            return res.status(500).send({ message: "Erro interno inesperado ao criar tipo de denúncia." });
        }
         
    }
}
}

