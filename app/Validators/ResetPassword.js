'use strict'

class ResetPassword {
  get rules() {
    return {
      'resetPassword.password': 'required|string',
      'resetPassword.resetPasswordToken': 'required|string'
    }
  }
}

module.exports = ResetPassword
