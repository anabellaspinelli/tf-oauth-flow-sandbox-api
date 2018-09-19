const express = require('express')
const passport = require('passport')
const TypeformStrategy = require('passport-typeform')
const dotenv = require('dotenv').config()

const app = express()

/* =====================
   Initialize passport
======================== */
app.use(passport.initialize())
app.use(passport.session())


/* =====================
   Configure Passport
======================== */
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
passport.use(
  new TypeformStrategy(
    {
      // options for the typeform strategy
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      scope: ['accounts:read']
    },
    (accessToken, refreshToken, profile, cb) => {
      // passport callback function fires after exchanging code for profile info
      cb(null, { access_token: accessToken, profile })
    }
  )
)


/* =====================
      Auth routes
======================== */

// authenticate with typeform
app.get('/auth/typeform', passport.authenticate('typeform'))

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
    console.log(req.user)
    res.redirect('/authenticated')
  }
)

const PORT = process.env.PORT || 9031

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
