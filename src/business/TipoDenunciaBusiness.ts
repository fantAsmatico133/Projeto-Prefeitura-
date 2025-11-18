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

    async criarTipoDenuncia(nome: string, departamento_id: Number): Promise<Number> {
        try {
            
            if (!nome) {
                throw new Error("O nome do tipo de denúncia é obrigatório.");
            }

            
            const tiposExistentes: Tipo_Denuncia[] = await this.TipoDenunciaData.pegarTiposDenuncia();

            const duplicado = tiposExistentes.find((tipoNoBanco) => {
                
                const nomeTipoDenuncia = tipoNoBanco.nome.toLowerCase().split(" ")[0];
                const reqNome = nome.toLowerCase().split(" ")[0];
                
                return nomeTipoDenuncia === reqNome;
            });
            
            if (duplicado) {
                throw new Error("Tipo Denúncia já existente com esse nome!");
            }
            
            const novoId = await this.TipoDenunciaData.criarTipoDenuncia(nome, departamento_id);
            
            return novoId; 

        } catch(error:any){
            throw new Error(error.message || 'Erro inesperado ao criar o tipo denuncia!');
        }
    }
}