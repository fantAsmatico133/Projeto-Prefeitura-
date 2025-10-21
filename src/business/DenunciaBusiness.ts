import  { DenunciaData } from "../data/DenunciaData";
import { Denuncias } from "../types/types";

export class DenunciaBusiness{
    denunciaData = new DenunciaData();
        public async pegarDenuncias():Promise<Denuncias[]>{
            try {
                const denuncia = await this.denunciaData .pegarDenuncias();
                return denuncia;
            } catch (error:any) {
                throw new Error("Usuários nao encontrados!");
            }
        }

}