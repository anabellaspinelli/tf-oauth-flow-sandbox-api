const SCOPES = require('../constans/scopes')

module.exports = (scopes) => {
  return scopes.every(scope => {
    return SCOPES.includes(scope)
  })
}
