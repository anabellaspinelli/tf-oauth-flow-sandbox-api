const express = require('express')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const setupStrategy = require('./setupStrategy')

const app = express()

app.use(session({
  secret: "thesecretgarden",
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.json())
dotenv.config()

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.get(
  '/auth/typeform/redirect',
  (req, res, next) => {
    // Handle the user declining consent
    if (!req.query.code) {
      throw new Error('User declined consent')
    }

    passport.authenticate('typeform')(req, res, next)
  },
  (req, res) => {
    /* this fires AFTER the strategy verify callback function
    the `user` obj comes in the request after running passport.serialize/deserialize */
    res.redirect('/authenticated')
  }
)

app.post('/auth/typeform/scopes', (req, res, next) => {
  setupStrategy(req.body.scopes)

  passport.authenticate('typeform')(req, res, next)
})

app.get(
  '/authenticated',
  (req, res) => {
    res.send(req.user)
  }
)

app.get('/', (req, res, next) => {
  res.sendStatus(200)
})

const PORT = process.env.PORT || 9031

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})

module.exports = server
