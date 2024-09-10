import express from "express";
import jwt from "jsonwebtoken"
import {  
     addUsuarios, 
     loginUsuarios, 
     getPrivateRoute
} from "../controllers/usuario.js";

const router = express.Router()

router.get("/private/:id", checkToken, getPrivateRoute)

router.post("/usuario/", addUsuarios)

router.post("/login/", loginUsuarios)

function checkToken(req, res, next) {
     const authHeader = req.headers['authorization']
     const token = authHeader && authHeader.split(' ')[1];

     if (!token) {
        return res.status(500).json({ message: 'Acesso negado.' });
     }

     try {
          const secret = process.env.SECRET

          jwt.verify(token, secret)

          next()

     } catch(error) {
           res.status(500).json({ message: 'Token invalido.' });
     }
}

export default router 
