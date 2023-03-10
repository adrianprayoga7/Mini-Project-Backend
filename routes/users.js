import express from 'express';
import { getUser, updateUser } from '../controllers/user.js';

const router = express.Router();

//routing setiap fungsi dari auth.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/find/:userId', getUser);
router.put('/', updateUser);

export default router;
