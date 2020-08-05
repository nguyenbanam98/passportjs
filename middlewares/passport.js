const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

const User = require('../models/Account.model')
// Passport local
const initPassportLocal = () => { passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username })

      if (!user) return done(null, false)

      const isCorrectPassword = await user.comparePassword(password)

      if (!isCorrectPassword) return done(null, false)

      done(null, user)
    } catch (error) {
      done(error, false)
    }
  }))
}
const passportLocal = function(req, res, next) { 
  passport.authenticate('local', function(err, user) {
    if (err) return res.status(500).json('loi server') 
    if (!user) return res.json('khong ton tai user')
    jwt.sign({
      iss: 'Nam Nguyen',
      sub: user._id,
      iat: new Date().getTime()
    }, 'mk', function(err, token) {
      if(err) res.json('loi server')
      return res.json(token)
    })
  })(req, res, next);
}

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = {
  initPassportLocal,
  passportLocal
}