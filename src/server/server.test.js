const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)

jest.setTimeout(30000);

it('Test for /all', async done => {
  const response = await request.get('/all')
  expect(response.status).toBe(200) // check if request was successfull
  expect(response.body).toBeDefined(); // check if response returned value of projecteData
  done()
})
