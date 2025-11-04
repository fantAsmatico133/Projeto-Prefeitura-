import express from 'express';
import { TipoDenunciaController } from '../controller/TipoDenunciaController';

export const tipoDenunciaRouter = express.Router();

const tipoDenunciaController = new TipoDenunciaController;

tipoDenunciaRouter.get("/", tipoDenunciaController.pegarTipoDenuncia);

