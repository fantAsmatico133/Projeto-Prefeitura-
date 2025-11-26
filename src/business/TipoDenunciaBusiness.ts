import { TipoDenunciaData } from "../data/TipoDenunciaData";
import { Tipo_Denuncia } from "../types/types";

export class TipoDenunciaBusiness{

    private TipoDenunciaData: TipoDenunciaData;

    constructor(tipoDenuncaData?: TipoDenunciaData){
        this.TipoDenunciaData = tipoDenuncaData || new TipoDenunciaData();
    }
   
    async pegarTipoDenuncia():Promise<Tipo_Denuncia[]>{
        try{
            const tipoDenuncia: Tipo_Denuncia[] = await this.TipoDenunciaData.pegarTiposDenuncia();
            return tipoDenuncia;
        }catch{
            throw new Error('Erro inesperado')
        }
    }

    async pegarTipoDenunciaPorId(id: number):Promise<Tipo_Denuncia[]>{
        try{
            const tipoDenuncia: Tipo_Denuncia[] = await this.TipoDenunciaData.TiposDenunciaPorId(id);
            if(tipoDenuncia.length === 0){
                throw new Error('Denúncia não encontrada');
            }else{
                return tipoDenuncia;
            }
        }catch(error: any){
            throw new Error(error.message || 'Erro inesperado ao encontrar o tipo denuncia');
        }
        
    }

    async criarTipoDenuncia(nome: string, departamento_id: number): Promise<number> {
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
            
            const novoId = Number(await this.TipoDenunciaData.criarTipoDenuncia(nome, departamento_id));
            
            return novoId; 

        } catch(error:any){
            throw new Error(error.message || 'Erro inesperado ao criar o tipo denuncia!');
        }
    }

    async atualizarTipoDenuncia(id: number, nome: string, departamento_id: number): Promise<void> {
        try {
            if (isNaN(id)) {
                throw new Error("ID inválido");
            }
            if (!nome || !departamento_id) {
                throw new Error("Nome e ID do departamento são obrigatórios para atualização");
            }

            const existe = await this.TipoDenunciaData.TiposDenunciaPorId(id);
            if (!existe) {
                throw new Error("Tipo de denúncia não encontrado");
            }

            await this.TipoDenunciaData.atualizarTipoDenuncia(id, nome, departamento_id);

        } catch (error: any) {
            throw new Error(error.message || "Erro ao atualizar tipo de denúncia");
        }
    }

    async deletarTipoDenuncia(id: number): Promise<void> {
        try {
            if (isNaN(id)) {
                throw new Error("ID inválido");
            }
            if (!id) {
                throw new Error("ID do tipo denuncia e obrigatório para deletar");
            }

            const existe = await this.TipoDenunciaData.TiposDenunciaPorId(id);
            if (!existe) {
                throw new Error("Tipo de denúncia não encontrado");
            }

            await this.TipoDenunciaData.deletarTipoDenuncia(id);

        } catch (error: any) {
            throw new Error(error.message || "Erro ao deletar tipo de denúncia");
        }
    }

    
}