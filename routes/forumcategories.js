import express from 'express';
import {
  forumGames,
  forumAcc,
  forumComp,
  forumEvent,
  forumHardware,
} from '../controllers/forumcategory.js';

//digunakan untuk membuat rute
const router = express.Router();

//routing setiap fungsi dari forumcategory.js
//tujuannya untuk merespon apa yang diminta user dari sisi client
router.get('/fgames', forumGames);
router.get('/facc', forumAcc);
router.get('/fcomp', forumComp);
router.get('/fevent', forumEvent);
router.get('/fhardware', forumHardware);

export default router;
