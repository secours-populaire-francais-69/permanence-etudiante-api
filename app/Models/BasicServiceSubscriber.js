'use strict'

const Model = use('Model')

/**
 *  @swagger
 *  definitions:
 *    BasicServiceSubscriber:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        basicServiceId:
 *          type: number
 *        userId:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *      required:
 *        - basicServiceId
 *        - userId
 */
class BasicServiceSubscriber extends Model {
  basicServices() {
    return this.belongsToMany('App/Models/BasicService')
  }

  users() {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = BasicServiceSubscriber
