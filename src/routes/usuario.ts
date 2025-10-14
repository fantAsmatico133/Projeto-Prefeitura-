import { Router } from "express";
import { Usuario } from "../types";

const router = Router();
let usuarios: Usuario[] = [];
let contador = 1;

// Criar usuário
router.post("/", (req, res) => {
  const { nome, email } = req.body;
  const novoUsuario: Usuario = { id: contador++, nome, email };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// Listar
router.get("/", (req, res) => {
  res.json(usuarios);
});

export default router;
