import express from 'express';
import { login, register, logout } from '../controllers/auth.js';

//digunakan untuk membuat rute
const router = express.Router();

//routing setiap fungsi dari auth.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
