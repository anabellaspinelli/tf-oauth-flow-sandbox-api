const chai = require('chai')

const validateScopes = require('../../src/validation/validateScopes')

describe('Validations', () => {
  it('should return true for valid scopes', () => {
    chai.expect(validateScopes([
      'accounts:read',
      'forms:read',
      'forms:write',
      'responses:read',
      'responses:write',
      'webhooks:read',
      'webhooks:write',
      'images:read',
      'images:write',
      'themes:read',
      'themes:write',
      'workspaces:read',
      'workspaces:write'
    ])).to.equal(true)
  })

  it('should return false for invalid scopes', () => {
    chai.expect(validateScopes([
      'pizza:eat'
    ])).to.equal(false)
  })
})
