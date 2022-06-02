import passport from 'passport';
import facebookStrategy from './facebookStrategy';
import twitterStrategy from './twitterStrategy';

passport.use(facebookStrategy);
passport.use(twitterStrategy);
