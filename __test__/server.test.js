const app = require('../src/server/index');
const request = require('supertest');

describe("Does GET return an object with a lat property", () => {
    test("Test GET response", async () => {
        const response = await request(app).get("/getData");
        expect(response.body).toHaveProperty('lat');
    });
});
