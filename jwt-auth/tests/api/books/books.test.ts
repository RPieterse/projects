import db from "../../../database/index";
// import mongoose from "mongoose";

describe("Books", () => {
  let jwt;
  beforeAll(async () => {
    await db.connectMemoryDb();
    // register user and set jwt
  });
  afterAll(async () => {
    await db.closeMemoryDb();
  });

  describe("books/", () => {
    // test different roles
    // test different routes
    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe("books/:id", () => {
    // test different roles
    // test different routes
    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });
});
