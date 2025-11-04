import { TipoDenunciaData } from "../data/TipoDenunciaData";
import { Tipo_Denuncia } from "../types/types";

export class TipoDenunciaBusiness{
   tipoDenunciaData = new TipoDenunciaData
    async pegarTipoDenuncia(){
        try{
            const tipoDenuncia: Tipo_Denuncia[] = await this.tipoDenunciaData.pegarTiposDenuncia();
            return tipoDenuncia;
        }catch{
            throw new Error('Erro inesperado')
        }
    }
}