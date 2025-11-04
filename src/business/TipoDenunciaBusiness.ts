import { TipoDenunciaData } from "../data/TipoDenunciaData";
import { Tipo_Denuncia } from "../types/types";

export class TipoDenunciaBusiness{
   TipoDenunciaData = new TipoDenunciaData
    async pegarTipoDenuncia():Promise<Tipo_Denuncia[]>{
        try{
            const tipoDenuncia: Tipo_Denuncia[] = await this.TipoDenunciaData.pegarTiposDenuncia();
            return tipoDenuncia;
        }catch{
            throw new Error('Erro inesperado')
        }
    }
}