const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Adjust the path based on your project structure

module.exports = function(passport) {
  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Local strategy for authenticating with a username and password
  passport.use(new LocalStrategy(
    {
      usernameField: 'email', // Assuming your login form uses an 'email' field
      passwordField: 'password',
    },
    (email, password, done) => {
      // Check if the user exists in the database
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.validPassword(password)) { // You should have a method to check the password
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
};
