import { Strategy } from 'passport-facebook';

let url = '';
if (process.env.NODE_ENV === 'development') {
  url = `http://${process.env.HOST}:${process.env.PORT}/auth/facebook/callback`;
} else {
  url = `https://${process.env.HOST}/auth/facebook/callback`;
}
const FacebookStrategy = new Strategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: url,
    profileFields: ['id', 'email', 'name', 'displayName', 'picture'],
  },
  ((token, tokenSecret, profile, done) => done(null, profile)),
);

export default FacebookStrategy;
