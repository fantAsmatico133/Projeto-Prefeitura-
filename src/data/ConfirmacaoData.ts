import { connection } from "../dbConnection";

export class ConfirmacaoData {
  async criarConfirmacao(usuario_id: number, denuncia_id: number) {
    try {
      const inserted = await connection('confirmacoes').insert([
        {
          data: new Date(),
          usuario_id,
          denuncia_id
        }
      ], ['id']);

      const id = (inserted[0] && (inserted[0].id || inserted[0])) || inserted;
      return id;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async existeConfirmacao(usuario_id: number, denuncia_id: number) {
    try {
      const row = await connection('confirmacoes')
        .where({ usuario_id, denuncia_id })
        .first();
      return !!row;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async contarConfirmacoesPorDenuncia(denuncia_id: number) {
    try {
      const result = await connection('confirmacoes')
        .where({ denuncia_id })
        .count('* as contagem');
      return result[0].contagem;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}
