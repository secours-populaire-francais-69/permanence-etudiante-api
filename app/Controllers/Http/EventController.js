'use strict'

const Event = use('App/Models/Event')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * @swagger
   * /events:
   *   get:
   *     summary: rest api to list events
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: list events
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Event'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async index({ response }) {
    const events = await Event.all()
    response.status(200).json(events)
  }

  /**
   * @swagger
   * /events:
   *   post:
   *     summary: rest api to create an event
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: event
   *         description: Event object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             event:
   *               type: object
   *               properties:
   *                 startAt:
   *                   type: datetime
   *                 endAt:
   *                   type: datetime
   *                 maxPeople:
   *                   type: number
   *                 title:
   *                   type: string
   *                 comment:
   *                   type: string
   *                 isFree:
   *                   type: boolean
   *                 isClosed:
   *                   type: boolean
   *     responses:
   *       201:
   *         description: create an event
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Event'
   *       400:
   *         description: missing params
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async store({ request, response }) {
    const { event } = request.only([
      'event.startAt',
      'event.endAt',
      'event.maxPeople',
      'event.title',
      'event.comment',
      'event.isFree',
      'event.isClosed'
    ])
    const createdEvent = await Event.create(event)
    response.status(201).json(createdEvent)
  }

  /**
   * @swagger
   * /events/{eventId}:
   *   get:
   *     summary: rest api to get details of an event
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: eventId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the event to get
   *     responses:
   *       200:
   *         description: get an event
   *         schema:
   *           $ref: '#/definitions/Event'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async show({ params, response }) {
    const event = await Event.findOrFail(params.id)
    response.status(200).json(event)
  }

  /**
   * @swagger
   * /events/{eventId}:
   *   put:
   *     summary: rest api to update an event
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: eventId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the event to get
   *       - name: event
   *         description: Event object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             event:
   *               type: object
   *               properties:
   *                 startAt:
   *                   type: datetime
   *                 endAt:
   *                   type: datetime
   *                 maxPeople:
   *                   type: number
   *                 title:
   *                   type: string
   *                 comment:
   *                   type: string
   *                 isFree:
   *                   type: boolean
   *                 isClosed:
   *                   type: boolean
   *     responses:
   *       200:
   *         description: updated event
   *         schema:
   *           $ref: '#/definitions/Event'
   *       400:
   *         description: missing params
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async update({ params, request, response }) {
    const eventToUpdate = await Event.findOrFail(params.id)
    const { event } = request.only([
      'event.startAt',
      'event.endAt',
      'event.maxPeople',
      'event.title',
      'event.comment',
      'event.isFree',
      'event.isClosed'
    ])
    eventToUpdate.merge(event)
    await eventToUpdate.save()
    response.status(200).json(eventToUpdate)
  }

  /**
   * @swagger
   * /events/{eventId}:
   *   delete:
   *     summary: rest api to delete an event
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: eventId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the event to delete
   *     responses:
   *       200:
   *         description: deleted event
   *         schema:
   *           $ref: '#/definitions/Event'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async destroy({ params, response }) {
    const eventToDelete = await Event.findOrFail(params.id)
    await eventToDelete.delete()
    response.status(200).json(eventToDelete)
  }
}

module.exports = EventController
