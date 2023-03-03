import User from "@root/models/user";
import db from "@root/database";
import mongoose from "mongoose";

describe("User Model", () => {
  beforeAll(async () => {
    await db.connectMemoryDb();
  });
  afterAll(async () => {
    await db.closeMemoryDb();
  });

  it("should fail to create an user without an email", async () => {
    const invalidUser = {
      username: "test",
      password: "test123ABC",
      role: "admin",
    };
    const userObj = new User(invalidUser);
    await userObj.save().catch((error) => {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(
        (error as mongoose.Error.ValidationError).errors.email
      ).toBeDefined();
    });
  });

  it("password should not be returned after santizing user", async () => {
    const userObj = {
      username: "test",
      email: "test1@test.com",
      password: "test123ABC",
      role: "admin",
    };
    const newUser = await User.create(userObj);
    expect(
      JSON.parse(JSON.stringify(newUser?.sanitize())).password
    ).toBeUndefined();
  });

  it("password should be encrypted", async () => {
    const userObj = {
      username: "test",
      email: "test2@test.com",
      password: "test123ABC",
      role: "admin",
    };
    const newUser = await User.create(userObj);
    expect(newUser.password).not.toBe(userObj.password);
    expect(newUser.getUserProperties().password).not.toBe(userObj.password);
  });

  it("should find user by email and password", async () => {
    const userObj = {
      password: "test123ABC",
      email: "test2@test.com",
    };
    const myUser = await User.findByEmailAndPassword(
      userObj.email,
      userObj.password
    );
    expect(myUser).toBeDefined();
    expect(JSON.parse(JSON.stringify(myUser?.sanitize())).id).toBeDefined();
  });

  it("should fail to find user by email and password", async () => {
    const userObj = {
      email: "test2@test.com",
    };
    await User.findByEmailAndPassword(userObj.email, "wrongPassword").catch(
      (error: Error) => {
        expect(error.message).toBe("Password not correct");
      }
    );
  });

  it("should return true if email already exists", async () => {
    const userObj = {
      email: "test2@test.com",
    };
    const duplicate = await User.isDuplicateEmail(userObj.email);
    expect(duplicate).toBeTruthy();
  });

  it("should return false if email does not exist", async () => {
    const userObj = {
      email: "test3@test.com",
    };
    const duplicate = await User.isDuplicateEmail(userObj.email);
    expect(duplicate).toBeFalsy();
  });
});
