import express from "express";
import { DepartamentoController } from "../controller/DepartamentoController";

export const departamentoRouter = express.Router();

const departamentoController = new DepartamentoController();

// retorna fila de prioridade do departamento (maior prioridade primeiro)
departamentoRouter.get("/fila", departamentoController.getFilaPrioridade);