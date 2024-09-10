import express from "express";
import userTarefas from "./routes/tarefas.js";
import userUsuarios from "./routes/usuarios.js";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/", userTarefas)
app.use("/", userUsuarios)

app.listen(8800)