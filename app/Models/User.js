'use strict'

const Env = use('Env')
const resetPasswordPrivateKey = Env.get('RESET_PASSWORD_PRIVATE_KEY')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const jwt = require('jsonwebtoken')

/**
 *  @swagger
 *  definitions:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        popAccueilNumber:
 *          type: string
 *        isVolunteer:
 *          type: boolean
 *        isAdmin:
 *          type: boolean
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *      required:
 *        - firstName
 *        - lastName
 *        - popAccueilNumber
 *        - isVolunteer
 *        - isAdmin
 *        - email
 */
class User extends Model {
  static get computed() {
    return ['fullName']
  }

  getFullName({ firstName, lastName }) {
    return `${firstName} ${lastName}`
  }
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  basicServices() {
    return this.manyThrough(
      'App/Models/BasicServiceSubscriber',
      'basicServices'
    )
  }

  posts() {
    return this.hasMany('App/Models/Post')
  }

  basicServiceSubscribers() {
    return this.hasMany('App/Models/BasicServiceSubscriber')
  }

  static get hidden() {
    return ['password']
  }

  generatePasswordToken() {
    return jwt.sign({ userId: this.id }, resetPasswordPrivateKey, {
      expiresIn: '1h'
    })
  }

  static verifyPasswordToken(token) {
    const decodedToken = jwt.verify(token, resetPasswordPrivateKey)
    return decodedToken.userId
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
