import { Response, Request } from "express";
import { DenunciaBusiness } from "../business/DenunciaBusiness";
import jsonwebtoken from 'jsonwebtoken';

export class DenunciaController{
     denunciaBusiness =  new DenunciaBusiness();
   public getEstatisticas = async (req: Request, res: Response) => {
    try {
      const stats = await this.denunciaBusiness.pegarEstatisticas();
      res.status(200).send(stats);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
   }

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
  ;

  public postDenuncia = async (req: Request, res: Response) => {
    try {
      const { titulo, descricao, endereco_denuncia, tipo_denuncia_id, anonimo } = req.body;

      if (!titulo || !descricao || !endereco_denuncia || !tipo_denuncia_id) {
        return res.status(400).send({ error: 'Campos obrigatórios ausentes: titulo, descricao, endereco_denuncia, tipo_denuncia_id' });
      }

      let usuarioId: number | null = null;
      const authHeader = req.headers.authorization as string | undefined;
      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2) {
          const token = parts[1];
          try {
            const chave = process.env.JWT_KEY as string;
            const payload: any = jsonwebtoken.verify(token, chave);
            if (payload && payload.id) usuarioId = Number(payload.id);
          } catch (err) {
            usuarioId = null;
          }
        }
      }

      const created = await this.denunciaBusiness.criarDenuncia({ titulo, descricao, endereco_denuncia, tipo_denuncia_id, anonimo }, usuarioId);
      res.status(201).send(created);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };
  };
}