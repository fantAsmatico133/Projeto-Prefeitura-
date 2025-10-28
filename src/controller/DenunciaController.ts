import { Response, Request } from "express";
import { DenunciaBusiness } from "../business/DenunciaBusiness";

export class DenunciaController{
     denunciaBusiness =  new DenunciaBusiness();

     public getDenuncia = async (req: Request, res: Response)=>{
        try{
            const users = await this.denunciaBusiness.pegarDenuncias();
            res.status(200).send(users);
        }catch(error:any){
            res.status(500).send({error: error.message});
        }
     }

     public getDenunciasAnonimas = async (req: Request, res: Response) => {
        try{
            const anonimas = await this.denunciaBusiness.pegarDenunciasAnonimas();
            res.status(200).send(anonimas);
        }catch(error:any){
            res.status(500).send({error: error.message});
        }
     }


  // Retorna fila de denúncias ordenada por prioridade (maior primeiro)
  public getFilaPrioridade = async (req: Request, res: Response) => {
    try {
      const fila = await this.denunciaBusiness.pegarDenunciasOrdenadasPorPrioridade();
      res.status(200).send(fila);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };
}