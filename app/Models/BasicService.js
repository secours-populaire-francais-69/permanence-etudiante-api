'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
 *  @swagger
 *  definitions:
 *    BasicService:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        startAt:
 *          type: datetime
 *        endAt:
 *          type: datetime
 *        maxPeople:
 *          type: number
 *        isClosed:
 *          type: boolean
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *      required:
 *        - startAt
 *        - endAt
 *        - isClosed
 */
class BasicService extends Model {
  static get dates() {
    return super.dates.concat(['startAt', 'endAt'])
  }

  users() {
    return this.manyThrough('App/Models/BasicServiceSubscriber', 'users')
  }

  basicServiceSubscribers() {
    return this.hasMany('App/Models/BasicServiceSubscriber')
  }
}

module.exports = BasicService
