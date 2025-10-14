export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  endereco: string;
  status: "pendente" | "em andamento" | "resolvido";
  usuarioId: number;
  departamentoId?: number;
  data: string;
}

export interface Departamento {
  id: number;
  nome: string;
}
