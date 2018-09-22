const passport = require('passport')
const TypeformStrategy = require('passport-typeform')

module.exports = scopes => {
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
        // passport VERIFY callback function fires after exchanging code for profile info
        cb(null, { access_token: accessToken, profile })
      }
    )
  )
}
