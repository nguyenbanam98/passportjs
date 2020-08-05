const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const accountRouter = require('./router/account')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/Account.model')
//const authorization = require('./middlewares/authorization')
const session = require('express-session')

const app = express()

app.use(cookieParser())

// connecting to mongo
mongoose.connect('mongodb://localhost/test_mongo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected database from mongodb.'))
.catch(error => console.error(`❌ Connect database is failed with error which is ${error}`))

// Middlewares
app.use(logger('dev'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(data, done) {
  done(null, data)
});

// routing

app.use('/api', accountRouter)

app.get('/login', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

passport.use(new LocalStrategy(
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

passport.use(new FacebookStrategy({
    clientID: '599537544268043',
    clientSecret: 'b7b8dc08bf9c64e209f40164b20d747f',
    callbackURL: 'https://20ace40d9eca.ngrok.io/auth/facebook/callback'
  }, function (accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    console.log(profile);
    return done(null, profile)
  }  
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json('ban da dang nhap facebook thanh cong');
  });

  app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.json('dang nhap thanh cong')
  });

app.get('/private', (req, res, next) => {
  if(req.isAuthenticated()) next()
  
  return res.json('ban chua dang nhap')
  
}, (req, res, next) => {
  res.json('ban dang nhap thanh cong')
})








// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    // response to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})
//start the server

app.listen(3000, () => console.log('Start server'))