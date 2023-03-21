import express from 'express';
import { getSubforums } from '../controllers/subforums.js';

const router = express.Router();

//routing setiap fungsi dari subforums.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/:subforumId', getSubforums);

export default router;
