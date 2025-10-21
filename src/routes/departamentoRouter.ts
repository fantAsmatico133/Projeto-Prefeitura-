import express from "express";
import { UserController } from "../controller/UserController";



export const departamentoRouter = express.Router();

const userController = new UserController();

departamentoRouter.get("/", userController.getAllUsers);