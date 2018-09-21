const express = require('express')
const passport = require('passport')
const cookieSession = require('cookie-session')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const setupStrategy = require('./setupStrategy')

const app = express()

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['aCookieKey']
  })
)
app.use(bodyParser.json())
dotenv.config()

/* =====================
   Initialize passport
======================== */

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
app.use(passport.initialize())
app.use(passport.session())

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
    /* this fires AFTER the passport callback function
    the `user` obj comes in the request as per passport.serialize/deserialize */
    console.log({ redirect: req.user })
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
