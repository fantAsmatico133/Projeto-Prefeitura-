import { Request, Response } from "express";
import { DenunciaBusiness } from "../business/DenunciaBusiness";

export class DepartamentoController {
  denunciaBusiness = new DenunciaBusiness();

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
