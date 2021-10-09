const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)

jest.setTimeout(30000);

it("Test for /all", async () => {
  const response = await request.get("/all");
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});
