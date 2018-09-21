const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

chai.use(chaiHttp)

describe('Endpoint', () => {
  it('GET root', done => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        if (err) done(err)
        chai.expect(res.status).to.equal(200)
        done()
      })
  })

  it('1 = 1', () => {
    chai.expect(1).to.equal(1)
  })
})
