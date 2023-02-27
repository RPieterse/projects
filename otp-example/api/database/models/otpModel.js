const mongoose = require("mongoose");
const { CodeError, isFalse } = require("../../utils/tools");
const moment = require("moment");
const validator = require("email-validator");
const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
    min: [6, "OTP is to short"],
    max: [6, "OTP is to long"],
  },
  email: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    default: true,
    required: true,
  },
  resent: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expire_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/**
 * @typedef {Object} OTP
 * @property {String} otp - The OTP of the user
 * @property {String} email - The email of the user
 * @property {Number} resent - How many times has the otp been resent
 * @property {Boolean} valid - Is the otp still valid
 * @property {Date} created_at - The creation date of the otp
 * @property {Date} expire_at - The expiration date of the otp
 */
const OTP = mongoose.model("OTP", otpSchema);

/**
 * Saves a new otp linked to a email address
 *
 * @param {String} email email of user
 * @param {Number} otp otp to save to email address
 * @param {Object} other override or add more values
 * @returns {Promise<OTP>} OTP
 */
async function saveOTPtoDB(email, otp, other) {
  // check email
  if (isFalse(email?.toString()) || isFalse(validator.validate(email))) {
    throw new CodeError("Please provide a valid email address", 400);
  }
  //check otp
  if (isFalse(otp?.toString())) {
    throw new CodeError("Please provide an otp", 400);
  }

  try {
    return OTP.create({
      otp,
      email,
      expire_at: moment(Date.now()).add(30, "seconds"),
      ...other
    });
  } catch (err) {
    throw new CodeError(err.message, 500);
  }
}

/**
 * Updates the resent value of a given otp linked to a email address
 *
 * @param {OTP} otp OTP document from db
 * @returns {Promise<OTP>} OTP
 */
async function updateResentValue(otp) {
  //check otp
  if (isFalse(otp)) {
    throw new CodeError("Please provide an otp", 400);
  }
  try {
    return OTP.findByIdAndUpdate(otp.id.toString(), { resent: otp.resent + 1 }, {new: true});
  } catch (err) {
    throw new CodeError(err.message, 500);
  }
}
/**
 * Updates the expire_at value of a given otp linked to a email address
 *
 * @param {OTP} otp OTP document from db
 * @returns {Promise<OTP>} OTP
 */
async function extendExpireAt(otp) {
  //check otp
  if (isFalse(otp)) {
    throw new CodeError("Please provide an otp", 400);
  }

  try {
    return OTP.findByIdAndUpdate(otp.id.toString(), {
      expire_at: moment(Date.now()).add(
        parseInt(process.env.OTP_EXP_SEC),
        "seconds"
      ),
    }, {new: true});
  } catch (err) {
    throw new CodeError(err.message, 500);
  }
}
/**
 * Updates the valid value of a given otp linked to a email address
 *
 * @param {OTP} otp OTP document from db
 * @returns {Promise<OTP>} OTP
 */
async function updateValidValue(otp, valid) {
  //check otp
  if (isFalse(otp)) {
    throw new CodeError("Please provide an otp", 400);
  }

  try {
    return OTP.findByIdAndUpdate(otp.id.toString(), { valid }, {new: true});
  } catch (err) {
    throw new CodeError(err.message, 500);
  }
}

/**
 * Function will fetch the latest OTP for a given email address
 *
 * @param   {String}    email   Email address of user
 *
 * @returns {Promise<OTP|Undefined>}  OTP will be returned if the user has one | Undefined will be returned otherwise
 */
async function getCurrentOTP(email) {
  // check email
  if (isFalse(email?.toString()) && isFalse(validator.validate(email))) {
    throw new CodeError("Please provide a valid email address", 400);
  }

  try {
    const otp = await OTP.find({ email }).limit(1).sort({ $natural: -1 });
    return otp?.[0];
  } catch (err) {
    throw new CodeError(err.message, err.code);
  }
}

/**
 * Function will fetch the last OTP's for a specified hours period
 *
 * @param   {String}    email   Email address of user
 * @param   {Number}    hours   Lookback period
 *
 * @returns {Promise<Array<OTP>>}  Array of OTP's that has been created in the past x hours
 */
async function getLastOtpsforH(email, hours) {
  // check email
  if (isFalse(email?.toString()) && isFalse(validator.validate(email))) {
    throw new CodeError("Please provide a valid email address", 400);
  }
  // check email
  if (isFalse(hours)) {
    throw new CodeError("Please provide hours to validate", 400);
  }

  try {
    return OTP.find({
      email,
      created_at: { $gte: moment().subtract(hours, "hours") },
    }).sort({ $natural: -1 });
  } catch (err) {
    throw new CodeError(err.message, err.code);
  }
}

module.exports = {
  OTP,
  getLastOtpsforH,
  getCurrentOTP,
  updateResentValue,
  saveOTPtoDB,
  updateValidValue,
  extendExpireAt,
};
