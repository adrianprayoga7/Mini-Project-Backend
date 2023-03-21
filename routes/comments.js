import express from 'express';
import {
  getComments,
  addComment,
  deleteComment,
} from '../controllers/comment.js';

//digunakan untuk membuat rute
const router = express.Router();

//routing setiap fungsi dari auth.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/', getComments);
router.post('/', addComment);
router.delete('/:id', deleteComment);

export default router;
