import express from "express";
import { UserController } from "../controller/UserController";
import * as authMiddleware from '../middlewares/auth';



export const userRouter = express.Router();

const userController = new UserController();

userRouter.get("/", userController.getAllUsers);

userRouter.post("/", userController.register);

userRouter.post("/login", userController.login);

userRouter.get("/me", authMiddleware.checkLogin,userController.getProfile);

