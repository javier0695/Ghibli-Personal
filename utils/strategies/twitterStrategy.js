import passport from 'passport';
import { Strategy } from 'passport-twitter';

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

let url = '';
if (process.env.NODE_ENV === 'development') {
  url = `http://${process.env.HOST}:${process.env.PORT}/auth/twitter/callback`;
} else {
  url = `https://${process.env.HOST}/auth/twitter/callback`;
}
const TwitterStrategy = new Strategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: url,
    includeEmail: true,
  },
  ((token, tokenSecret, profile, done) => {
    const newUser = {
      id: profile._json.id_str,
      email: profile._json.email,
      name: profile._json.name,
      picture: {
        data: {
          url: profile._json.profile_image_url,
        },
      },
    };
    return done(null, newUser);
  }),
);

export default TwitterStrategy;
