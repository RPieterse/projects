import db from "@root/database";
import { createMocks } from "node-mocks-http";
import {
  register as localRegister,
  validate as validateLocalRegister,
} from "@root/pages/api/auth/local/register";
import {
  login as localLogin,
  validate as validateLocalLogin,
} from "@root/pages/api/auth/local";
import { NextApiRequest, NextApiResponse } from "next";
import { signOut } from "@root/pages/api/auth/logout";

describe("Auth Flow", () => {
  let jwt: string = "";

  beforeAll(async () => {
    await db.connectMemoryDb();
  });

  afterAll(async () => {
    await db.closeMemoryDb();
  });

  describe("Register", () => {
    describe("Local Register", () => {
      // test new user
      it("it should create a new user and send back the user data with an auth_token cookie", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          body: {
            email: "test@test.com",
            password: "test1234ABC",
          },
        });

        await localRegister(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse
        );

        // check status code
        expect(res._getStatusCode()).toBe(200);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          id: expect.any(String),
          email: "test@test.com",
          username: "test",
          role: "user",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });

        // extract the auth_token cookie in the header set-cookie
        const cookie = res.getHeader("set-cookie");
        expect(cookie).toBeDefined();
        expect(cookie).toEqual(
          expect.arrayContaining([
            expect.stringContaining("auth_token="),
            expect.stringContaining("Max-Age=86400"),
            expect.stringContaining("HttpOnly"),
          ])
        );
        // save the jwt token for later use
        jwt = (cookie as string[])[0].split("=")[1].split(";")[0];
      });
      // test duplicate emails
      it("it should not create a new user with existing email address and send back an error message", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          body: {
            email: "test@test.com",
            password: "test1234ABC",
          },
        });

        await localRegister(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Email already exists",
        });
      });
      // test invalid email
      it("it should send back an error message when email is invalid", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          body: {
            email: "invalidemail",
            password: "test1234ABC",
          },
        });

        validateLocalRegister(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse,
          () => {}
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Email is invalid",
        });
      });
      // test invalid password
      it("it should send back an error message when password is invalid", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          body: {
            email: "test@test.com",
            password: "invalidpassword",
          },
        });

        validateLocalRegister(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse,
          () => {}
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Password is invalid",
        });
      });
    });
  });

  describe("Login", () => {
    describe("Local Login", () => {
      // test new user
      it("it should create a newlogin an user and send back the user data with an auth_token cookie", async () => {
        const { req, res } = createMocks({
          method: "POST",
          body: {
            email: "test@test.com",
            password: "test1234ABC",
          },
        });

        await localLogin(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse
        );

        // check status code
        expect(res._getStatusCode()).toBe(200);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          id: expect.any(String),
          email: "test@test.com",
          username: "test",
          role: "user",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });

        // extract the auth_token cookie in the header set-cookie
        const cookie = res.getHeader("set-cookie");
        expect(cookie).toBeDefined();
        expect(cookie).toEqual(
          expect.arrayContaining([
            expect.stringContaining("auth_token="),
            expect.stringContaining("Max-Age=86400"),
            expect.stringContaining("HttpOnly"),
          ])
        );
      });
      // test unregistred email
      it("it should not find a user with unregistered email address and send back an error message", async () => {
        const { req, res } = createMocks({
          method: "POST",
          body: {
            email: "test1@test.com",
            password: "test1234ABC",
          },
        });

        await localLogin(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Invalid email address",
        });
      });
      // test wrong password
      it("it should not find a user with unregistered email address and send back an error message", async () => {
        const { req, res } = createMocks({
          method: "POST",
          body: {
            email: "unregistered@test.com",
            password: "wrongpassword",
          },
        });

        await localLogin(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Invalid email address",
        });
      });
      // test invalid email
      it("it should send back an error message when email is invalid", async () => {
        const { req, res } = createMocks({
          method: "POST",
          body: {
            email: "invalidemail",
            password: "test1234ABC",
          },
        });

        validateLocalLogin(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse,
          () => {}
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Email is invalid",
        });
      });
      // test invalid password
      it("it should send back an error message when password is invalid", async () => {
        const { req, res } = createMocks({
          method: "POST",
          body: {
            email: "test@test.com",
            password: "invalidpassword",
          },
        });

        validateLocalLogin(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse,
          () => {}
        );

        // check status code
        expect(res._getStatusCode()).toBe(400);

        // check if the response is a json object with correct data
        expect(res._getJSONData()).toEqual({
          error: "Password is invalid",
        });
      });
    });
  });

  describe("Logout", () => {
    it("it should delete the auth_token cookie", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        headers: {
          cookie: `auth_token=${jwt}`,
        },
      });

      await signOut(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      // check status code
      expect(res._getStatusCode()).toBe(200);

      // check if the response is a json object with correct data
      expect(res._getJSONData()).toEqual(true);

      // extract the auth_token cookie in the header set-cookie
      const cookie = res.getHeader("set-cookie");
      expect(cookie).toBeDefined();
      expect(cookie).toEqual(
        expect.arrayContaining([
          expect.stringContaining("auth_token="),
          expect.stringContaining("Max-Age=-1"),
        ])
      );
    });
  });
});
