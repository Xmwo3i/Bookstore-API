const request = require("supertest");
const app = require("../index"); 

describe("GET /books", () => {
  it("should return an array of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});