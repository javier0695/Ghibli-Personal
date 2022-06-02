import express from 'express';
import { success, error as _error } from '../network/response';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    success(req, res, 'Welcome to our API', 200);
  } catch (error) {
    console.log(error);
    _error(req, res, error, 400);
  }
});

export default router;
