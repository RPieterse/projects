import user from "../../models/user";
import db from "../../database/index";
import mongoose from "mongoose";

describe("User Model", () => {
  beforeAll(async () => {
    await db.connectMemoryDb();
  });
  afterAll(async () => {
    await db.closeMemoryDb();
  });

  it("should create an user succesfully", () => {
    const userObj = {
      username: "test",
      email: "test@test.com",
      password: "test123ABC",
      role: "admin",
    };
    const useObj = new user(userObj);
    expect(useObj).toBeDefined();
  });

  it("should fail to create an user without an email", async () => {
    const invalidUser = {
      username: "test",
      password: "test123ABC",
      role: "admin",
    };
    const userObj = new user(invalidUser);
    await userObj.save().catch((error) => {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(
        (error as mongoose.Error.ValidationError).errors.email
      ).toBeDefined();
    });
  });

  it("password should be encrypted", async () => {
    const userObj = {
      username: "test",
      email: "test2@test.com",
      password: "test123ABC",
      role: "admin",
    };
    const newUser = await user.create(userObj);
    expect(newUser.password).not.toBe(userObj.password);
    expect(newUser.getUserProperties().password).not.toBe(userObj.password);
  });

  it("should find user by email and password", async () => {
    const userObj = {
      password: "test123ABC",
      email: "test2@test.com",
    };
    const myUser = await user.findByEmailAndPassword(
      userObj.email,
      userObj.password
    );
    expect(myUser).toBeDefined();
  });

  it("password should not be returned when sanitizing user object", async () => {
    const userObj = {
      password: "test123ABC",
      email: "test2@test.com",
    };
    const myUser = await user.findByEmailAndPassword(
      userObj.email,
      userObj.password
    );
    expect(
      JSON.parse(JSON.stringify(myUser.sanitize())).password
    ).toBeUndefined();
  });
});
