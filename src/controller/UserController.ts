import { Response, Request, NextFunction } from "express";
import { Userbusiness } from "../business/UserBusiness";
import jsonwebtoken from "jsonwebtoken";


export class UserController{
     userBusiness =  new Userbusiness();

     public getAllUsers = async (req: Request, res: Response)=>{
        try{
            const users = await this.userBusiness.pegarUsuarios();
            res.status(200).send(users);
        }catch(error:any){
            res.status(500).send({error: error.message});
        }
     }

     register = async (req: Request, res:Response)=>{
        try{
            const {name,email,password} = req.body;
            if(!name || !email || !password){
                return res.status(400).send({error: "Um dos campos não foi inserido!"})
            }
            const newUser = await this.userBusiness.postarNovoUsuario(name,email,password);
            res.status(201).send(newUser);
        }catch(error: any ){
            if(error.message === "Email já vinculado em um usuário"){
                res.status(409).send(error.message);
            }else{
                res.status(500).send("ERRO inesperado")
            }
        }
     }

    login = async (req: Request, res:Response)=>{
        try{
            const {email,password} = req.body;
            if(!email || !password){
                return res.status(400).send({error: "Um dos campos não foi inserido!"})
            }
            const token = await this.userBusiness.login(email,password);
            res.status(200).send(token);
        }catch(error: any ){
            if(error.message === "Email não existe"){
                res.status(409).send(error.message);
            }else if(error.message === 'Senha inválida!'){
                res.status(401).send(error.message);
            }
            else{
                res.status(500).send("ERRO inesperado")
            }
        }
     }

     public getProfile = async (req: Request, res: Response)=>{
        try{
            const userPayload = (req as any).usuario
            if(!userPayload){
                return res.status(500).send({error: "Payload não existe!"});
            }
            res.status(200).send(userPayload);
        }catch(error:any){
            res.status(500).send({error: "Erro não esperado!"});
        }
     }



     
}