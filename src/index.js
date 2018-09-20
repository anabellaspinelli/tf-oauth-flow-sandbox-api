const express = require('express')
const passport = require('passport')
const TypeformStrategy = require('passport-typeform')
const cookieSession = require('cookie-session')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

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

/* =====================
      Auth routes
======================== */

app.get(
  '/auth/typeform/redirect',
  (req, res, next) => {
    // Handle the user declining consent
    if (!req.query.code) {
      return res.redirect('/')
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

/* =====================
      Other routes
======================== */
app.get(
  '/authenticated',
  (req, res) => {
    res.send(req.user)
  }
)

const PORT = process.env.PORT || 9031

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))

const setupStrategy = scopes => {
  passport.use(
    new TypeformStrategy(
      {
        // options for the typeform strategy
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URI,
        scope: scopes
      },
      (accessToken, refreshToken, profile, cb) => {
        // passport callback function fires after exchanging code for profile info
        cb(null, { access_token: accessToken, profile })
      }
    )
  )
}
