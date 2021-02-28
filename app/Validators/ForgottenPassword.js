"use strict";

class ForgottenPassword {
  get rules() {
    return {
      "forgottenPassword.email": "required|email",
    };
  }
}

module.exports = ForgottenPassword;
