const { sendMail } = require("../utils/emails");
const {
  shouldNewOTPBeSent,
  allowUserToRequestOtp,
  generateOtp,
  validateOTP,
} = require("../utils/otp");
const { isFalse, isAbiggerThanB } = require("../utils/tools");
const moment = require("moment");
const {
  OTP,
  saveOTPtoDB,
  updateResentValue,
  updateValidValue,
  extendExpireAt,
  getCurrentOTP,
  getLastOtpsforH,
} = require("../database/models/otpModel");
const { toInteger, delay } = require("lodash");

describe("Test for tools.utils", () => {
  test("isFalse equal to true", () => {
    expect(isFalse(false)).toBeTruthy();
    expect(isFalse(true)).toBeFalsy();
  });
  test("IsABiggerThanB", () => {
    expect(isAbiggerThanB(1, 2)).toBeFalsy();
    expect(isAbiggerThanB(4, 2)).toBeTruthy();
  });
});

describe("Test for emails.utils", () => {
  test("Sending email fails with error without giving an email address", async () => {
    await sendMail(
      "Testing Email Trigger",
      undefined,
      "This is only a test message"
    ).catch((e) => {
      expect(e.message).toBe("Please provide an email address");
    });
  });
});

describe("Test for otp.utils", () => {
  describe("Should New OTP Be Sent", () => {
    test("A new OTP should be sent to user if it has reached 3 resends", () => {
      const shouldSendNewOTP = shouldNewOTPBeSent({
        valid: true,
        resent: 3,
        created_at: Date.now(),
      });
      expect(shouldSendNewOTP).toBeTruthy();
    });
    test("A new OTP should be sent to user if it is not valid anymore", () => {
      const shouldSendNewOTP = shouldNewOTPBeSent({
        valid: false,
        resent: 2,
        created_at: Date.now(),
      });
      expect(shouldSendNewOTP).toBeTruthy();
    });
    test("A new OTP should be sent to user if it is older than 5 minutes", () => {
      const shouldSendNewOTP = shouldNewOTPBeSent({
        valid: true,
        resent: 2,
        created_at: moment(Date.now()).subtract(5, "minutes"),
      });
      expect(shouldSendNewOTP).toBeTruthy();
    });
    test("Resend OTP to the user", () => {
      const shouldSendNewOTP = shouldNewOTPBeSent({
        valid: true,
        resent: 2,
        created_at: moment(Date.now()).subtract(2, "minutes"),
      });
      expect(shouldSendNewOTP).toBeFalsy();
    });
  });

  describe("Allow user to request OTP", () => {
    beforeEach(async () => {
      await require("../database/initialize").connect(false);
    });
    afterEach(async () => {
      await require("../database/initialize").disconnect(false);
    });

    test("Allow user to request otp with no previous OTP's", async () => {
      const allow = await allowUserToRequestOtp("test@unittest.app");
      expect(allow).toBeTruthy();
    });
    test("Do not allow user to request otp when more than 3 has been created in the past hour", async () => {
      // create 3 documents
      await OTP.create([
        {
          otp: "123456",
          valid: false,
          created_at: Date.now(),
          resent: 0,
          expire_at: Date.now(),
          email: "test@unittest.app",
        },
        {
          otp: "123456",
          valid: false,
          created_at: Date.now(),
          resent: 2,
          expire_at: Date.now(),
          email: "test@unittest.app",
        },
        {
          otp: "123456",
          valid: false,
          created_at: Date.now(),
          resent: 0,
          expire_at: Date.now(),
          email: "test@unittest.app",
        },
      ]);
      const allow = await allowUserToRequestOtp("test@unittest.app");
      expect(allow).toBeFalsy();
      await OTP.deleteMany({ email: "test@unittest.app" });
    });
    test("Allow user to request otp when more than 3 has been created but not in the past hour", async () => {
      // create 3 documents
      await OTP.create([
        {
          otp: "123456",
          valid: false,
          created_at: Date.now(),
          resent: 0,
          expire_at: Date.now(),
          email: "test@unittest.app",
        },
        {
          otp: "123456",
          valid: false,
          created_at: moment(Date.now()).subtract(2, "hours"),
          resent: 2,
          expire_at: Date.now(),
          email: "test@unittest.app",
        },
        {
          otp: "123456",
          valid: false,
          created_at: Date.now(),
          resent: 0,
          expire_at: Date.now(),
          email: "test@unittest.app",
        },
      ]);
      const allow = await allowUserToRequestOtp("test@unittest.app");
      expect(allow).toBeTruthy();
      await OTP.deleteMany({ email: "test@unittest.app" });
    });
  });

  describe("Generate OTP", () => {
    beforeEach(async () => {
      await require("../database/initialize").connect(false);
    });
    afterEach(async () => {
      await require("../database/initialize").disconnect(false);
    });

    test("OTP Code should be 6 digits", async () => {
      const otp = await generateOtp("test@unittest.app");
      expect(otp).toHaveLength(6);
    });
    test("OTP can start with 0", async () => {
      let otp = 1;

      while (otp[0] != 0) {
        otp = await generateOtp("test@unittest.app");
      }
      expect(toInteger(otp[0])).toBe(0);
    });
  });

  describe("Validate OTP", () => {
    test("OTP should be valid", () => {
      const otp = {
        otp: "123456",
        valid: true,
        created_at: Date.now(),
        resent: 2,
        expire_at: moment(Date.now()),
        email: "test@unittest.app",
      };
      expect(
        validateOTP("test@unittest.app", "123456", otp).success
      ).toBeTruthy();
    });
    test("OTP should be expired", () => {
      expect.assertions(2);
      const otp = {
        otp: "123456",
        valid: true,
        created_at: Date.now(),
        resent: 2,
        expire_at: moment(Date.now()).subtract(1, "seconds"),
        email: "test@unittest.app",
      };
      expect(
        validateOTP("test@unittest.app", "123456", otp).success
      ).toBeFalsy();
      expect(validateOTP("test@unittest.app", "123456", otp).message).toBe(
        "OTP has expired"
      );
    });
    test("OTP should be invalid", () => {
      expect.assertions(2);
      const otp = {
        otp: "123456",
        valid: false,
        created_at: Date.now(),
        resent: 2,
        expire_at: moment(Date.now()).add(10, "seconds"),
        email: "test@unittest.app",
      };
      expect(
        validateOTP("test@unittest.app", "123456", otp).success
      ).toBeFalsy();
      expect(validateOTP("test@unittest.app", "123456", otp).message).toBe(
        "OTP is invalid"
      );
    });
    test("OTP should not match", () => {
      expect.assertions(2);
      const otp = {
        otp: "123457",
        valid: true,
        created_at: Date.now(),
        resent: 2,
        expire_at: moment(Date.now()).add(10, "seconds"),
        email: "test@unittest.app",
      };
      expect(
        validateOTP("test@unittest.app", "123456", otp).success
      ).toBeFalsy();
      expect(validateOTP("test@unittest.app", "123456", otp).message).toBe(
        "OTP's do not match"
      );
    });
    test("Emails of OTP should not match", () => {
      expect.assertions(2);
      const otp = {
        otp: "123456",
        valid: true,
        created_at: Date.now(),
        resent: 2,
        expire_at: moment(Date.now()).add(10, "seconds"),
        email: "test1@unittest.app",
      };
      expect(
        validateOTP("test@unittest.app", "123456", otp).success
      ).toBeFalsy();
      expect(validateOTP("test@unittest.app", "123456", otp).message).toBe(
        "Email Addresses do not match"
      );
    });
  });

  describe("Handle OTP in DB", () => {
    beforeEach(async () => {
      await require("../database/initialize").connect(false);
    });
    afterEach(async () => {
      await OTP.deleteMany({ email: "test@unittest.app" });
      await require("../database/initialize").disconnect(false);
    });

    test("Create OTP", async () => {
      const otp = await saveOTPtoDB("test@unittest.app", "123456");
      expect(otp._id).toBeDefined();
    });
    test("Fail to create OTP without email", async () => {
      await saveOTPtoDB(undefined, "123456").catch((err) => {
        expect(err.message).toBe("Please provide a valid email address");
      });
    });

    test("Update OTP resent value", async () => {
      const otp = await saveOTPtoDB("test@unittest.app", "123456");
      const updatedOtp = await updateResentValue(otp);
      expect(updatedOtp.resent).toBe(1);
    });

    test("Update OTP valid value", async () => {
      const otp = await saveOTPtoDB("test@unittest.app", "123456");
      const updatedOtp = await updateValidValue(otp, false);
      expect(updatedOtp.valid).toBeFalsy();
    });

    test("Update OTP expire value", async () => {
      const otp = await saveOTPtoDB("test@unittest.app", "123456", {
        expire_at: moment(Date.now()).subtract(1, "minute"),
      });
      const updatedOtp = await extendExpireAt(otp);
      expect(new Date(updatedOtp.expire_at).getTime()).toBeGreaterThan(
        new Date().getTime()
      );
    });

    test("Get Current OTP", async () => {
      await saveOTPtoDB("test@unittest.app", "123456", { valid: false });
      await saveOTPtoDB("test@unittest.app", "123457");
      const otp = await getCurrentOTP("test@unittest.app");
      expect(otp.otp).toBe("123457");
    });

    test("Get OTP's for x hours", async () => {
      await saveOTPtoDB("test@unittest.app", "123456", {created_at: moment(Date.now()).subtract('1', 'hour')});
      await saveOTPtoDB("test@unittest.app", "123456", {created_at: moment(Date.now()).subtract('4', 'hours')});
      await saveOTPtoDB("test@unittest.app", "123456", {created_at: moment(Date.now()).subtract('8', 'hours')});
      await saveOTPtoDB("test@unittest.app", "123456", {created_at: moment(Date.now()).subtract('30', 'minutes')});
      await saveOTPtoDB("test@unittest.app", "123457");
      const otpsHour = await getLastOtpsforH("test@unittest.app", 1);
      const otpsDay = await getLastOtpsforH("test@unittest.app", 24);

      expect(otpsHour.length).toBe(2);
      expect(otpsDay.length).toBe(5);
      expect.assertions(2)
    });
  });
});
