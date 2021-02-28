"use strict";

class Signup {
  get rules() {
    return {
      firstName: "required|string",
      lastName: "required|string",
      popAcceuilNumber: "required|string",
      isVolunteer: "required|boolean",
      isAdmin: "required|boolean",
      email: "required|email|unique:users",
      password: "required|string",
    };
  }
}

module.exports = Signup;
