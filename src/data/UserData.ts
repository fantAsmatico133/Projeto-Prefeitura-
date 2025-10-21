import { connection } from "../dbConnection";
import { PapelUsuario, User } from "../types/types";
export class UserData {

    async pegarUsuarios() {
        try {
            const users = await connection('users').select();
            return users;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async criarUsuarioNoBancoDeDados(name: string, email: string, password: string, papel: PapelUsuario):Promise<number>{
        try {
            const user = await connection('users')
                .insert([{ name: name, email: email, password: password, papel: papel }],['id']);
            const novoId:number = user[0].id;
            return novoId;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async pegarUsuarioPeloEmailNoBD(userEmail: string) {
        try {
            const userE: User = await connection('users').where({ email: userEmail }).first();
            return userE;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

}