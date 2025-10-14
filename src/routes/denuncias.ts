import { Router } from "express";
import { Denuncia } from "../types";

const router = Router();

let denuncias: Denuncia[] = [];
let contador = 1;

// Criar denúncia
router.post("/", (req, res) => {
  const { titulo, descricao, endereco, usuarioId, departamentoId } = req.body;

  const novaDenuncia: Denuncia = {
    id: contador++,
    titulo,
    descricao,
    endereco,
    usuarioId,
    departamentoId,
    status: "pendente",
    data: new Date().toISOString(),
  };

  denuncias.push(novaDenuncia);
  res.status(201).json(novaDenuncia);
});

// Listar todas
router.get("/", (req, res) => {
  res.json(denuncias);
});

// Atualizar status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const denuncia = denuncias.find((d) => d.id === Number(id));
  if (!denuncia) return res.status(404).json({ message: "Denúncia não encontrada" });

  denuncia.status = status;
  res.json(denuncia);
});

// Deletar
router.delete("/:id", (req, res) => {
  denuncias = denuncias.filter((d) => d.id !== Number(req.params.id));
  res.json({ message: "Denúncia removida" });
});

export default router;
