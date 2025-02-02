import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const GoogleRecaptcha = ({ onVerify }) => {
  const handleCaptchaChange = (token) => {
    if (onVerify) {
      onVerify(token); // Pass the token to the parent component
    }
  };

  return (
    <ReCAPTCHA
      sitekey="6LdV2sMqAAAAAArCoYlP8lSg8iYGv1orZT-wJ_oX" // Replace with your reCAPTCHA site key
      onChange={handleCaptchaChange}
    />
  );
};

export default GoogleRecaptcha;
