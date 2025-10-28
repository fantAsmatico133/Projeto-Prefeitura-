import { connection } from "../dbConnection";
import { TipoUsuario, User } from "../types/types";
export class UsuarioData {

    async pegarUsuarios() {
        try {
            const users = await connection('usuarios').select();
            return users;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async criarUsuarioNoBancoDeDados(nome: string, email: string, senha_hash: string, tipo: TipoUsuario):Promise<Number>{
        try {
            const user = await connection('usuarios')
                .insert([{ nome: nome, email: email, senha_hash: senha_hash, papel: tipo }],['id']);
            const novoId:number = user[0].id;
            return novoId;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async pegarUsuarioPeloEmailNoBD(userEmail: string) {
        try {
            const userE: User = await connection('usuarios').where({ email: userEmail }).first();
            return userE;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

}