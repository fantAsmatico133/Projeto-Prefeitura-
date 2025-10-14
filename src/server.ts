import express from "express";
import cors from "cors";
import denunciasRoutes from "./routes/denuncias";
import usuariosRoutes from "./routes/usuario";
import departamentosRoutes from "./routes/departamento";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/denuncias", denunciasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/departamentos", departamentosRoutes);

app.get("/", (req, res) => {
  res.send("API Prefeitura+ está rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
