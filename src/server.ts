import { app } from "./app";
import {denunciaRouter} from "./routes/denunciasRouter";
import {userRouter} from "./routes/userRouter";
import {departamentoRouter} from "./routes/departamentoRouter";
import dotenv from "dotenv";

dotenv.config();

app.use("/denuncias", denunciaRouter);
app.use("/usuarios", userRouter);
app.use("/departamentos", departamentoRouter);

const PORT = process.env.PORT || 3003;

app.listen(PORT, ()=>{
    console.log(`API rodando na porta ${PORT}`);
});

