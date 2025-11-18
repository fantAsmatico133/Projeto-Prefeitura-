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
            }else{
                const pegarTipoDenunciaPorId: Tipo_Denuncia[] = await this.tipoDenunciaBusiness.pegarTipoDenunciaPorId(id);
                res.status(200).send(pegarTipoDenunciaPorId);
            }
        }catch(error: any){
            if(error.message.includes('Denúncia não encontrada')){
                res.status(404).send(error.message);
            }else{
                console.log("tradução errada");
                res.status(500).send(error.message);
            }
        }
    }
}

