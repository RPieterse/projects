const { getLastOtpsforH } = require("../database/models/otpModel");
const { CodeError, isFalse } = require("./tools");
const moment = require("moment");

/**
 * Function will check whether a new OTP should be generated
 *
 * @description The OTP's created_at will be checked to determine whether a new OTP should be generated
 *
 * @param   {OTP} otp OTP document from db
 *
 * @returns {Boolean}    TRUE if latest OTP should be resent | False if new OTP should be generated
 */
function shouldNewOTPBeSent(otp) {
  if (isFalse(otp)) {
    throw new CodeError("Please provide an OTP", 400);
  }

  if (
    otp.valid &&
    parseInt(process.env.OTP_RESEND_LIMIT) > otp.resent &&
    moment(Date.now()).diff(moment(new Date(otp.created_at)), "minutes") <
      parseInt(process.env.OTP_RESEND_BUFFER_MIN)
  ) {
    return false;
  }
  return true;
}

/**
 * Checks if user is allowed to request another otp
 * @param {String} email email address of user
 * @returns {Promise<Boolean>}
 */
async function allowUserToRequestOtp(email) {
  if (isFalse(email?.toString())) {
    throw new CodeError("Please provide an email address", 400);
  }

  try {
    const xOtps = await getLastOtpsforH(email, 1);
    if (xOtps.length < parseInt(process.env.OTP_REQ_LIMIT_HOUR)) {
      return true;
    }
    return false;
  } catch (err) {
    new CodeError(err.message, 500);
  }
}

/**
 * Function generates an unique OTP for a user
 *
 * @description Checks the database for OTP's sent within the past 24H,
 * these values are checked in order to generate an unique code for the user
 *
 * @param   {String}  email   Email address of user
 *
 * @returns {Promise<Number>}   6 digit otp (can include 0)
 */
async function generateOtp(email) {
  if (isFalse(email?.toString())) {
    throw new CodeError("Please provide an email address", 400);
  }

  try {
    let _otp = undefined;

    // fetch all otps for given email that has been generated the past 24h
    const listOfOtpsfor24H = await getLastOtpsforH(email, 24);

    // generate an unique 6 digit code that was not created in the past 24h
    while (!_otp) {
      const testOtp = ("000000" + Math.floor(Math.random() * 1000000)).slice(
        -6
      );
      if (isFalse(listOfOtpsfor24H.includes(testOtp))) {
        _otp = testOtp;
      }
    }
    return _otp;
  } catch (err) {
    throw new CodeError(err.message, 500);
  }
}

/**
 * Function will validate the OTP against specific validation checks
 *
 * @description Validates against a given expiration time and
 * checks if the OTP matches with the latest generated one
 *
 * @param   {String}  email   Email address of user
 * @param   {Number}  otpCode OTP to be validated
 * @param   {OTP}     currentOtp     OTP document from db 
 * @returns {Object}  {success, message}
 */
function validateOTP(email, otpCode, currentOtp) {
  // check valid
  if (isFalse(currentOtp.valid)) {
    return { success: false, message: "OTP is invalid" };
  }
  // check email
  if (isFalse(email === currentOtp.email)) {
    return { success: false, message: "Email Addresses do not match" };
  }
  // check expire_at
  if (
    moment(new Date(currentOtp.expire_at)).diff(moment(Date.now()), "seconds") <
    0
  ) {
    return { success: false, message: "OTP has expired" };
  }
  // check match
  if (isFalse(otpCode === currentOtp.otp)) {
    return { success: false, message: "OTP's do not match" };
  }
  return { success: true, message: "" };
}

module.exports = {
  shouldNewOTPBeSent,
  validateOTP,
  generateOtp,
  allowUserToRequestOtp,
};
