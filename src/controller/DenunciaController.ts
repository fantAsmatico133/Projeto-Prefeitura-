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
}