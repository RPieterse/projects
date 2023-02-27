import { useState } from "react";
import validator from "email-validator";
import { isEmpty } from "lodash";
import { api, CodeError, isFalse } from "../utils/index.js";

function useOTP() {
  // States
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  /**
   * Function to validate the params passed to the requestOtp function
   *
   * @param {String} emailAddress Email address of user
   *
   * @returns {Object} {success: Boolean, message: String}
   */
  function validateOtpRequestParams(emailAddress) {
    if (
      isEmpty(emailAddress?.trim()) ||
      isFalse(validator.validate(emailAddress))
    ) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }
    return { success: true, message: "" };
  }

  /**
   * Function to validate the params passed to the requestOtp function
   *
   * @param {String} emailAddress Email address of user
   *
   * @returns {Object} {success: Boolean, message: String}
   */
  function validateOtpVerifyParams(emailAddress, otp) {
    if ( isEmpty(emailAddress?.trim()) ||
    isFalse(validator.validate(emailAddress))) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }
    if (
      isEmpty(otp.toString()?.trim()) ||
      isFalse(otp.toString().length === 6)
    ) {
      return {
        success: false,
        message: "Please enter a valid OTP",
      };
    }
    return { success: true, message: "" };
  }

  /**
   * Function to request OTP from server
   *
   * @param {String} emailAddress Email address of user
   *
   * @returns {Boolean}
   */
  async function requestOtp(emailAddress) {
    // validate params
    const validation = validateOtpRequestParams(emailAddress);
    if (isFalse(validation.success)) {
      throw new CodeError(validation.message, 403);
    }

    // show loading indicator
    setLoading(true);

    // make api request
    try {
      await api({
        url: "/otp/request",
        method: 'post',
        data: {
          email: emailAddress,
        },
      });
      sessionStorage.setItem("email", emailAddress);
    } catch (err) {
      // hide loading indicator
      setLoading(false);
      throw new CodeError(err?.response?.data || err.message, err.code);
    }

    // hide loading indicator
    setLoading(false);

    // return success
    return true;
  }

  async function verifyOtp(emailAddress, otp) {
    // validate params
    const validation = validateOtpVerifyParams(emailAddress, otp);
    if (isFalse(validation.success)) {
      throw new CodeError(validation.message, 403);
    }

    // show loading indicator
    setLoading(true);

    // make api request
    try {
      await api({
        url: "/otp/verify",
        method: 'post',
        data: {
          email: emailAddress,
          otp: otp
        },
      });
    } catch (err) {
      // hide loading indicator
      setLoading(false);
      throw new CodeError(err?.response?.data || err.message, err.code);
    }

    // clear otp
    setOtp('')

    // hide loading indicator
    setLoading(false);

    // return success
    return true;
  }

  return {
    otp,
    setOtp,
    verifyOtp,
    requestOtp,
    email,
    setEmail,
    loading,
  };
}

export default useOTP;
