const express = require('express')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const setupStrategy = require('./setupStrategy')
const validateScopes = require('./validation/validateScopes')

const app = express()

app.use(session({
  secret: 'thesecretgarden',
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.json())
dotenv.config()

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  process.env.ENV === 'dev' && console.info({ user })
  done(null, user)
})
passport.deserializeUser((user, done) => {
  process.env.ENV === 'dev' && console.info({ user })
  done(null, user)
})

app.post('/auth/typeform/scopes', (req, res, next) => {
  const scopes = req.body.scopes

  if (validateScopes(scopes)) {
    setupStrategy(req.body.scopes)
    return passport.authenticate('typeform')(req, res, next)
  }

  res.status(400).send('Bad request, scopes must be an array of valid scopes')
})

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
    res.send(req.user)
  }
)

app.get('/', (req, res, next) => {
  res.sendStatus(200)
})

const PORT = process.env.PORT || 9031

const server = app.listen(PORT, () => {
  process.env.ENV === 'dev' && console.log(`server listening on port ${PORT}`)
})

module.exports = server
