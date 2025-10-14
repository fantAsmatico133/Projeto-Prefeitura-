import { Router } from "express";
import { Departamento } from "../types";

const router = Router();
let departamentos: Departamento[] = [
  { id: 1, nome: "Iluminação Pública" },
  { id: 2, nome: "Limpeza Urbana" },
  { id: 3, nome: "Pavimentação" },
];

router.get("/", (req, res) => {
  res.json(departamentos);
});

export default router;
