import db from "@root/database";

describe("Auth Flow", () => {
  let jwt: string = "";

  afterAll(async () => {
    await db.closeMemoryDb();
  });

  describe("Register", () => {
    // test new user
    // test existing user
    // test if password is too short
    // test if already logged in

    it("it should create a new user and send back the user data with a auth_token cookie", async () => {});
  });

  describe("Login", () => {
    // test login
    // test if already logged in
    // test if user doesn't exist
    // test if password is wrong

    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe("Logout", () => {
    // test if user is logged out
    // test if user is not logged in

    it("should equal 4", () => {
      expect(2 + 2).toBe(4);
    });
  });
});
