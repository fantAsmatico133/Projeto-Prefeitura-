import express from "express";
import { DenunciaController } from "../controller/DenunciaController";
import { checkLogin, checkAdmin } from "../middlewares/auth";



export const denunciaRouter = express.Router();

const denunciaController= new DenunciaController();

denunciaRouter.get("/", denunciaController.getDenuncia);
denunciaRouter.get("/estatisticas", checkLogin, checkAdmin, denunciaController.getEstatisticas);
denunciaRouter.get("/anonimas", denunciaController.getDenunciasAnonimas);
// retorna fila de prioridade do departamento (maior prioridade primeiro)
denunciaRouter.get("/fila", denunciaController.getFilaPrioridade);
denunciaRouter.post("/", denunciaController.postDenuncia);
// Confirmar denúncia (usuário autenticado)
denunciaRouter.post("/:id/confirmar", checkLogin, denunciaController.confirmarDenuncia);
// Postar comentário em denúncia (usuário autenticado)
denunciaRouter.post("/:id/comentarios", checkLogin, denunciaController.postarComentario);



