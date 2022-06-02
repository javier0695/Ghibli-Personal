import express from 'express';
import multer from 'multer';
import passport from 'passport';
import { success, error as _error } from '../../network/response';
import {
  findOrCreate, addUser, findUser, updateUser,
} from './controller';

const auth = express.Router();
const user = express.Router();

const upload = multer({
  dest: 'public/files/',
});

auth.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

auth.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, authType: 'rerequest', scope: ['public_profile', 'email'] }),
  async (req, res) => {
    try {
      const data = await findOrCreate(req.user._json);
      success(req, res, data);
    } catch (error) {
      _error(req, res, `${error}`, 500);
    }
  },
);

auth.get('/auth/twitter', passport.authenticate('twitter'));

auth.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter'),
  async (req, res) => {
    try {
      const data = await findOrCreate(req.user);
      success(req, res, data);
    } catch (error) {
      _error(req, res, `${error}`, 500);
    }
  },
);

auth.post('/signup', async (req, res) => {
  try {
    const data = await addUser(req.body);
    success(req, res, data, 201);
  } catch (error) {
    _error(req, res, `${error}`, 500);
  }
});

auth.post('/login', async (req, res) => {
  try {
    const data = await findUser(req.body);
    success(req, res, data, 200);
  } catch (error) {
    _error(req, res, `${error}`, 500);
  }
});

user.patch('/update', upload.single('profilePic'), async (req, res) => {
  try {
    const data = await updateUser(req.user, req.body, req.file);
    success(req, res, data, 200);
  } catch (error) {
    _error(req, res, `${error}`, 500);
  }
});

export {
  user,
  auth,
};
