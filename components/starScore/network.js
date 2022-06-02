import express from 'express';
import { success, error as _error } from '../../network/response';
import addStarScore from './controller';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const score = await addStarScore(req.body, req.user);
    success(req, res, score, 201);
  } catch (error) {
    console.log(error);
    _error(req, res, error, 400);
  }
});

export default router;
