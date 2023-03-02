// import the string helpers file
import helpers from "@root/helpers/strings";

// test isEmail from helpers.isEmail
describe("helpers.isEmail", () => {
  it("should return true for a valid email", () => {
    const email = "test@test.com";
    expect(helpers.isEmail(email)).toBe(true);
  });
  it("should return false for an invalid email", () => {
    const email = "test";
    expect(helpers.isEmail(email)).toBe(false);
  });
});

// test isValidPassword from helpers.isValidPassword
describe("helpers.isValidPassword", () => {
  it("should return true for a valid password", () => {
    const password = "test123ABC";
    expect(helpers.isValidPassword(password)).toBe(true);
  });
  it("should return false for an invalid password", () => {
    const password = "test";
    expect(helpers.isValidPassword(password)).toBe(false);
  });
});
