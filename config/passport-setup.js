const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const db = require("../models/");


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findById(id).then((user) => {
  done(null, user);
  });
  
});



passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
  //passport callback
    db.User.findOne({
      where: {
        google_id: profile.id
      }
    })
    .then((userData) => {
      if (userData === null) {
        db.User.create({
          display_name: profile.displayName,
          firstName: profile.name.givenName,
          google_id: profile.id,
          google_image: profile.photos[0].value,
          player_funds: 1000
        })
        .then((results) => {
          done(null, results);
        });  
      }
      else {
        done(null, userData);
      }
    });
  })
)