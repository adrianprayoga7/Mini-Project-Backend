import express from 'express';
import { getLikes, addLike, deleteLike } from '../controllers/like.js';

const router = express.Router();

//routing setiap fungsi dari like.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/', getLikes);
router.post('/', addLike);
router.delete('/', deleteLike);

export default router;
