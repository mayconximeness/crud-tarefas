import { db } from "../db.js";

export const getTarefas = (_, res) => {
     const q = "SELECT * FROM tarefas";

     db.query(q, (err, data) => {
          if(err) return res.json(err);

          return res.status(200).json(data);
     });
};

export const addTarefas = (req, res) => {
     const q =
          "INSERT INTO tarefas(`titulo`, `descricao`, `data_criacao`, `id_usuario`) VALUES(?)";

     const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
     
     const values = [
          req.body.titulo,
          req.body.descricao,
          currentDateTime,
          1
     ];

     db.query(q, [values], (err) => {
          if (err) return res.json(err);

          return res.status(200).json("Tarefa criado com sucesso.");
     });
};

export const updateTarefas = (req, res) => {
     const q =
          "UPDATE tarefas SET `titulo` = ?, `descricao` = ?, `conclusao` = ? WHERE `id` = ?";

     const values = [
          req.body.titulo,
          req.body.descricao,
          req.body.conclusao 
     ];

     db.query(q, [...values, req.params.id], (err) => {
          if (err) return res.json(err);

          return res.status(200).json("Tarefa atualizado com sucesso.");
     });
};

export const deleteTarefas = (req, res) => {
     const q =
          "DELETE FROM tarefas WHERE `id` = ?";

     db.query(q, [req.params.id], (err) => {
          if (err) return res.json(err);

          return res.status(200).json("Tarefa deletado com sucesso.");
     });
};