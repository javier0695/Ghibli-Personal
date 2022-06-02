import express from 'express';
import { success, error as _error } from '../../network/response';
import addEmojiScore from './controller';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const score = await addEmojiScore(req.body, req.user);
    success(req, res, score, 201);
  } catch (error) {
    _error(req, res, error, 400, error);
  }
});

export default router;
