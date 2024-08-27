const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {User} = require('../models');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
          console.log('Incorrect username.');
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          console.log('Incorrect password.');
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        console.log('Authentication error.');
        return done(error, false, { message: 'Authentication error.' });
      }
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findByPk(id, function(err, user) {
      done(err, user);
    });
  });
};