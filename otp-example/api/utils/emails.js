const nodemailer = require("nodemailer");
const { CodeError, isFalse } = require("./tools");
/**
 * E-Mail config
 */
const mailTransporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 1025,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send an email to anyone
 *
 * @param {String} subject subject line of the email you want to send
 * @param {String} email email address to whom you want to send the mail
 * @param {String} message message containing the body of the mail
 *
 * @returns {Promise<Boolean>}
 */
async function sendMail(subject, email, message) {
  if (isFalse(email?.toString())) {
    throw new CodeError("Please provide an email address", 400);
  }
  try {
    // send mail with defined transport object
    await mailTransporter.sendMail({
      from: "no-reply@entrostat.xyz", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: message, // html body
    });
    return true;
  } catch (err) {
    throw new CodeError(err.message, 500);
  }
}

module.exports = { sendMail };
