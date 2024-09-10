import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { promisify } from 'util';

const queryAsync = promisify(db.query).bind(db);

export const getPrivateRoute = async (req, res) => {   
    
     const id = req.params.id;

    const getUserQuery = 'SELECT * FROM usuarios WHERE id = ?';

    try {
        const results = await queryAsync(getUserQuery, [id]);

        // Verifica se nenhum usuário foi encontrado
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Se o usuário for encontrado, retorne os dados desejados (aqui apenas retornando o id como exemplo)
        return res.status(200).json(results[0]);
    } catch (error) {
        // Trata erros que possam ocorrer na consulta
        return res.status(500).json({ message: 'Erro ao verificar o usuário.' });
    }
};

export const addUsuarios = async (req, res) => {
    const q = "INSERT INTO usuarios(`nome`, `email`, `senha`, `data_criacao`) VALUES (?)";
    const { nome, email, senha, confirmpassword } = req.body;

    if (!nome) {
        return res.status(400).json({ message: 'Campo "nome" é obrigatório.' });
    }

    if (!email) {
        return res.status(400).json({ message: 'Campo "email" é obrigatório.' });
    }

    if (!senha) {
        return res.status(400).json({ message: 'Campo "senha" é obrigatório.' });
    }

    if (senha !== confirmpassword) {
        return res.status(400).json({ message: 'As senhas não conferem.' });
    }

    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';

    db.query(checkEmailQuery, [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Erro ao verificar o e-mail.' });
        }

        const exists = results[0].count > 0;

        if (exists) {
            return res.status(400).json({ message: 'Usuário com este e-mail já existe.' });
        }

        try {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(senha, salt);

            const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const values = [
                nome, email, passwordHash, currentDateTime
            ];

            db.query(q, [values], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Erro ao criar o usuário.' });
                }

                return res.status(200).json("Usuário criado com sucesso.");
            });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao processar a senha.' });
        }
    });
};

export const loginUsuarios = async (req, res) => {
     const { email, senha } = req.body;
 
     if (!email) {
         return res.status(400).json({ message: 'Campo "email" é obrigatório.' });
     }
 
     if (!senha) {
         return res.status(400).json({ message: 'Campo "senha" é obrigatório.' });
     }
 
     const getUserQuery = 'SELECT id, senha FROM usuarios WHERE email = ?';

     db.query(getUserQuery, [email], async (error, results) => {
         if (error) {
             return res.status(500).json({ message: 'Erro ao verificar o e-mail.' });
         }
 
         // Verifica se o usuário foi encontrado
         if (results.length === 0) {
             return res.status(400).json({ message: 'Usuário não encontrado.' });
         }
 
         // Recupera o hash da senha do banco de dados
         const { id, senha: hashedPassword } = results[0];

         try {
          const checkPassword = await bcrypt.compare(senha, hashedPassword);

          if (!checkPassword) {
              return res.status(400).json({ message: 'Senha inválida.' });
          }

          const secret = process.env.SECRET;

          if (!secret) {
              return res.status(500).json({ message: 'Segredo para token não configurado.' });
          }

          const token = jwt.sign({ id }, secret, { expiresIn: '8h' });

          return res.status(200).json({ message: 'Autenticação realizada com sucesso.', token });

      } catch (err) {
          return res.status(500).json({ message: 'Erro ao gerar o token.' });
      }
     });
 };
