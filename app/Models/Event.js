'use strict'

const Model = use('Model')

/**
 *  @swagger
 *  definitions:
 *    Event:
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
 *        title:
 *          type: string
 *        comment:
 *          type: string
 *        isFree:
 *          type: boolean
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
 *        - title
 *        - comment
 *        - isFree
 *        - isClosed
 */
class Event extends Model {
  static get dates() {
    return super.dates.concat(['startAt', 'endAt'])
  }
}

module.exports = Event
