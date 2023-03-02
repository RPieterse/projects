import db from "../../../database/index";
// import mongoose from "mongoose";

describe("Auth Flow", () => {
  let jwt;

  beforeAll(async () => {
    await db.connectMemoryDb();
  });
  afterAll(async () => {
    await db.closeMemoryDb();
  });

  describe("Register", () => {
    // test existing user
    // test if password is too short
    // test if already logged in

    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe("Login", () => {
    // test if already logged in
    // test if user doesn't exist
    // test if password is wrong

    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe("Logout", () => {
    // test if user is not logged in

    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });
});
