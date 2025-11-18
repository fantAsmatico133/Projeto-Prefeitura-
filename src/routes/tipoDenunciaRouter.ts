import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import { TipoDenunciaController } from '../controller/TipoDenunciaController';

export const tipoDenunciaRouter = express.Router();

const tipoDenunciaController = new TipoDenunciaController;

tipoDenunciaRouter.get("/", tipoDenunciaController.pegarTipoDenuncia);

tipoDenunciaRouter.get("/:id", tipoDenunciaController.pegarTipoDenunciaPorId);

tipoDenunciaRouter.post("/",
    authMiddleware.checkLogin,
    authMiddleware.checkAdmin,
    tipoDenunciaController.criarTipoDenuncia);

