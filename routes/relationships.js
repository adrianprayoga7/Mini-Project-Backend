import express from 'express';
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
} from '../controllers/relationship.js';

const router = express.Router();

//routing setiap fungsi dari relationship.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/', getRelationships);
router.post('/', addRelationship);
router.delete('/', deleteRelationship);

export default router;
