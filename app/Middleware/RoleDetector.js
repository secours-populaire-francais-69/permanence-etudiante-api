'use strict'

class RoleDetector {
  async handle({ response, auth }, next, props) {
    const currentUser = await auth.getUser()
    if (props.includes('volunteer') && !currentUser.isVolunteer) {
      return response.status(401).json({ message: 'not authorized' })
    }
    if (props.includes('admin') && !currentUser.isAdmin) {
      return response.status(401).json({ message: 'not authorized' })
    }
    await next()
  }
}

module.exports = RoleDetector
