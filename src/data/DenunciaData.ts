import { connection } from "../dbConnection";

export class DenunciaData {
    async pegarDenuncias() {
        try {
            const denuncias = await connection('users').select();
            return denuncias;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

}