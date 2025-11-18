import { connection } from "../dbConnection";

export class ComentarioData {
  async criarComentario(texto: string, usuario_id: number, denuncia_id: number, tipo_usuario: string) {
    try {
      const inserted = await connection('comentarios').insert([
        {
          texto,
          data: new Date(),
          usuario_id,
          denuncia_id,
          tipo_usuario
        }
      ], ['id']);

      const id = (inserted[0] && (inserted[0].id || inserted[0])) || inserted;
      return id;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async pegarComentariosPorDenuncia(denuncia_id: number) {
    try {
      const rows = await connection('comentarios').where({ denuncia_id }).select();
      return rows;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}
