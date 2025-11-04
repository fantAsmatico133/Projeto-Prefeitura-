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
}

