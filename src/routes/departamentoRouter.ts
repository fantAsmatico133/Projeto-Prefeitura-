import express from "express";
import { DepartamentoController } from "../controller/DepartamentoController";
import * as authMiddleware from '../middlewares/auth';

export const departamentoRouter = express.Router();

const departamentoController = new DepartamentoController();

departamentoRouter.get("/", departamentoController.pegarDepartamentos);

departamentoRouter.get("/:id", departamentoController.pegarDepartamentoPorId);

departamentoRouter.post("/",
    authMiddleware.checkLogin,      
    authMiddleware.checkAdmin,      
    departamentoController.criarDepartamento
);