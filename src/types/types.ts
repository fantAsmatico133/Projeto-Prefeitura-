export type TipoUsuario = 'cidadao' | 'funcionario';
export type StatusDenuncia = 'Pendente'| 'Em análise'| 'Resolvido';

export type User = {
    id: Number;
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario
};

export type Denuncias = {
    id:number;
    titulo:string;
    descricao: string;
    endereco: string;
    status: StatusDenuncia;
    anonimo:boolean;
    usuario_id: number | null;
    departamento_id: number;
    prioridade?: number; // campo calculado automaticamente pelo backend (quanto maior, maior prioridade)
}

export type Departamento = {
    id:number;
    nome:string;
}
