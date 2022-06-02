import movies from '../components/movies/network';
import { user, auth } from '../components/user/network';
import emojiScore from '../components/emojiScore/network';
import starScore from '../components/starScore/network';
import authenticate from '../middleware/auth';
import home from '../components/home';

function router(server) {
  server.use('/', home);
  server.use('/movies', authenticate, movies);
  server.use('/user', authenticate, user);
  server.use('/', auth);
  server.use('/emojiScore', authenticate, emojiScore);
  server.use('/starScore', authenticate, starScore);
}

export default router;
