import express from 'express';
import { getPosts, addPost, deletePost } from '../controllers/post.js';

const router = express.Router();

//routing setiap fungsi dari post.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/', getPosts);
router.post('/', addPost);
router.delete('/:id', deletePost);

export default router;
