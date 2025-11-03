import express from "express";
import { UsuarioController } from "../controller/UserController";
import * as authMiddleware from '../middlewares/auth';



export const usuarioRouter = express.Router();

const usuarioController = new UsuarioController();

usuarioRouter.post("/", usuarioController.register);

usuarioRouter.post("/login", usuarioController.login);

usuarioRouter.get("/me", authMiddleware.checkLogin,usuarioController.getProfile);

