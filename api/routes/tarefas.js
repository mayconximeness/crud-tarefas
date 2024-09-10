import express from "express";
import { 
     getTarefas, 
     addTarefas, 
     updateTarefas, 
     deleteTarefas 
} from "../controllers/tarefa.js";

const router = express.Router()

router.get("/", getTarefas)

router.post("/", addTarefas)

router.put("/:id", updateTarefas)

router.delete("/:id", deleteTarefas)

export default router 
