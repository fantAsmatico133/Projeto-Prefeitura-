import  { UserData } from "../data/UserData";
import { TipoUsuario, User } from "../types/types";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";


export class Userbusiness{
    userData = new UserData();

    public async pegarUsuarios():Promise<User[]>{
        try {
            const users = await this.userData.pegarUsuarios();
                return users;
        } catch (error:any) {
                throw new Error("Usuários nao encontrados!");
        }
    }

    public async postarNovoUsuario(nome: string, email: string, senha: string){
        try{
            const emailVinculado = await this.userData.pegarUsuarioPeloEmailNoBD(email);
            if(emailVinculado){
                throw new Error("Email já vinculado em um usuário");
            }else{
                const senhaHash = await bcrypt.hash(senha, 10);
                const tipo: TipoUsuario = 'cidadao'
                const newUser = await this.userData.criarUsuarioNoBancoDeDados(nome,email,senhaHash,tipo);
                return newUser;
            }
        }catch{
           throw new Error("Erro inesperado"); 
        }
    }

    public async login(email: string, senha: string){
        try{
            const emailVinculado = await this.userData.pegarUsuarioPeloEmailNoBD(email);
            if(emailVinculado){
                const senhaValida = await bcrypt.compare(senha, emailVinculado.senha)
                if(senhaValida){
                    
                    const payload = {
                        id: emailVinculado.id,
                        papel: emailVinculado.tipo
                    }

                    const chaveSecreta = process.env.JWT_KEY as string;

                    const token = jsonwebtoken.sign(payload,chaveSecreta)

                    return token;
                }else{
                    throw new Error('Senha inválida!');
                }
            }else{
                throw new Error('Email não existe! Por favor crie uma nova conta.');
            }
        }catch(error:any){
            throw new Error('Erro inesperado');
        }
    }
}