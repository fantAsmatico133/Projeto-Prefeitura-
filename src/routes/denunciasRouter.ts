import express from "express";
import { DenunciaController } from "../controller/DenunciaController";



export const denunciaRouter = express.Router();

const denunciaController= new DenunciaController();

denunciaRouter.get("/", denunciaController.getDenuncia);

//denunciaRouter.post("/", denunciaController.postDenuncia);

//denunciaRouter.push("/", denunciaController.pushDenuncia);

//denunciaRouter.patch("/:id/status", denunciaController.patchDenuncia);

//denunciaRouter.delete("/:id", denunciaController.patchDenuncia);

// Criar denúncia


