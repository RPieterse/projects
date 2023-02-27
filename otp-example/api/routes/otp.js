const express = require("express");
const router = express.Router();
const { isEmpty } = require("lodash");
const {
  getCurrentOTP,
  updateResentValue,
  saveOTPtoDB,
  updateValidValue,
  extendExpireAt,
} = require("../database/models/otpModel");
const { sendMail } = require("../utils/emails");
const {
  allowUserToRequestOtp,
  shouldNewOTPBeSent,
  generateOtp,
  validateOTP,
} = require("../utils/otp");
const { isFalse } = require("../utils/tools");

/* Generate & send OTP */
router.post("/request", async function (req, res) {
  const { email } = req.body;

  // validations
  if (isEmpty(email?.trim())) {
    res.status(400).send("Please provide an email address");
  }
  try {
    // get current otp
    let otp = (await getCurrentOTP(email));
    if (isFalse(otp)) {
      // generate new otp
      otp = await generateOtp(email);
      //  save the new otp to the db
      await saveOTPtoDB(email, otp);
    } else {
      // check if user may request another otp
      const otpAllowed = await allowUserToRequestOtp(email);

      // check if previous otp was sent in the past x minutes, if otp was sent x minutes ago, check how many times it was resent
      // if less than x amount, resend latest
      const sendNewOtp = shouldNewOTPBeSent(otp);

      if (sendNewOtp) {
        if (isFalse(otpAllowed)) {
          return res
            .status(400)
            .send("You have requested to many OTP's, try again later");
        }
      }

      if (sendNewOtp) {
        // invalidate previous otp
        await updateValidValue(otp, false);
        // generate new otp
        otp = await generateOtp(email);
        //  save the new otp to the db
        await saveOTPtoDB(email, otp);
      } else {
        await updateResentValue(otp);
        await extendExpireAt(otp);
      }
    }

    // send an email to the user
    await sendMail("Here is your OTP", email, `Your OTP is: ${otp.otp || otp}`);

    return res.send(true);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/* Validate OTP */
router.post("/verify", async function (req, res) {
  const { otp, email } = req.body;
  // validate
  if (isEmpty(email?.trim())) {
    res.status(400).send("Please provide an email address");
  }
  if (isEmpty(otp?.trim())) {
    res.status(400).send("Please provide an otp");
  }

  // get current otp
  try {
    const currentOtp = (await getCurrentOTP(email));
    if (isFalse(currentOtp)){
      res.status(500).send('No OTP found.');
    }
    const { success, message } = validateOTP(email, otp, currentOtp);
    if (success) {
      await updateValidValue(currentOtp, false);
      return res.send(true);
    }
    res.status(403).send(message);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
