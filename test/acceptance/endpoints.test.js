const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src')
const nock = require('nock')

const setupStrategy = require('../../src/setupStrategy')

const profileResponse = require('../mock-data/profileResponse.mock')
const tokenResponse = require('../mock-data/tokenResponse.mock')

chai.use(chaiHttp)

const nockOptions = { allowUnmocked: true }

describe('Endpoints', () => {
  before(() => {
    nock('https://api.typeform.com', nockOptions)
      .persist()
      .post('/oauth/token')
      .reply(200, tokenResponse)

    nock('https://api.typeform.com', nockOptions)
      .persist()
      .get('/me')
      .reply(200, profileResponse)
  })

  it('should return 200 when getting "/"', done => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        if (err) done(err)
        chai.expect(res.status).to.equal(200)
        done()
      })
  })

  it('should return 200 when posting scopes to "/auth/typeform/scopes"', done => {
    chai.request(server)
      .post('/auth/typeform/scopes')
      .send({
        scopes: [
          'accounts:read'
        ]
      })
      .end((err, res) => {
        if (err) done(err)
        chai.expect(res.status).to.equal(200)
        done()
      })
  })

  it('should return 400 when posting invalid scopes to "/auth/typeform/scopes"', done => {
    chai.request(server)
      .post('/auth/typeform/scopes')
      .send({
        scopes: [
          'accounts:accounts'
        ]
      })
      .end((err, res) => {
        if (err) done(err)
        chai.expect(res.status).to.equal(400)
        done()
      })
  })

  it('should return 200 when posting scopes to "/auth/typeform/redirect"', done => {
    setupStrategy(['accounts:read'])

    chai.request(server)
      .get('/auth/typeform/redirect')
      .query({
        code: 'alskdjalskdjalskdjalsdkjalskdjalsd'
      })
      .end((err, res) => {
        if (err) done(err)
        chai.expect(res.status).to.equal(200)
        chai.expect(res.body).to.have.property('access_token')
        chai.expect(res.body).to.have.property('profile')
        done()
      })
  })
})
