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

    async pegarTipoDenunciaPorId(id: Number):Promise<Tipo_Denuncia[]>{
        try{
            const tipoDenuncia: Tipo_Denuncia[] = await this.TipoDenunciaData.TiposDenunciaPorId(id);
            if(tipoDenuncia.length == 0){
                console.log('esta caindo aqui')
                throw new Error('Denúncia não encontrada');
            }else{
                return tipoDenuncia;
            }
        }catch(error: any){
            throw new Error(error.message || 'Erro inesperado ao encontrar o tipo denuncia');
        }
        
    }
}