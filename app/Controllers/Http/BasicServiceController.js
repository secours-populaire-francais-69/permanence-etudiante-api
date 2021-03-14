'use strict'

const BasicService = use('App/Models/BasicService')

/**
 * Resourceful controller for interacting with basic-services
 */
class BasicServiceController {
  /**
   * @swagger
   * /basic-services:
   *   get:
   *     summary: rest api to list basic services
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: list basic services
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/BasicService'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async index({ response }) {
    const basicServices = await BasicService.all()
    response.status(200).json(basicServices)
  }

  /**
   * @swagger
   * /basic-services:
   *   post:
   *     summary: rest api to create an basic service
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: basicService
   *         description: BasicService object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             basicService:
   *               type: object
   *               properties:
   *                 startAt:
   *                   type: datetime
   *                 endAt:
   *                   type: datetime
   *                 maxPeople:
   *                   type: number
   *                 isClosed:
   *                   type: boolean
   *     responses:
   *       201:
   *         description: create an basic service
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/BasicService'
   *       400:
   *         description: missing params
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async store({ request, response }) {
    const { basicService } = request.only([
      'basicService.startAt',
      'basicService.endAt',
      'basicService.maxPeople',
      'basicService.isClosed'
    ])
    const createdBasicService = await BasicService.create(basicService)
    response.status(201).json(createdBasicService)
  }

  /**
   * @swagger
   * /basic-services/{basicServiceId}:
   *   get:
   *     summary: rest api to get details of an basic service
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: basicServiceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the basic service to get
   *     responses:
   *       200:
   *         description: get an basic service
   *         schema:
   *           $ref: '#/definitions/BasicService'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async show({ params, response }) {
    const basicService = await BasicService.findOrFail(params.id)
    response.status(200).json(basicService)
  }

  /**
   * @swagger
   * /basic-services/{basicServiceId}:
   *   put:
   *     summary: rest api to update an basic service
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: basicServiceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the basic service to get
   *       - name: basicService
   *         description: BasicService object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             basicService:
   *               type: object
   *               properties:
   *                 startAt:
   *                   type: datetime
   *                 endAt:
   *                   type: datetime
   *                 maxPeople:
   *                   type: number
   *                 isClosed:
   *                   type: boolean
   *     responses:
   *       200:
   *         description: updated basic service
   *         schema:
   *           $ref: '#/definitions/BasicService'
   *       400:
   *         description: missing params
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async update({ params, request, response }) {
    const basicServiceToUpdate = await BasicService.findOrFail(params.id)
    const { basicService } = request.only([
      'basicService.startAt',
      'basicService.endAt',
      'basicService.maxPeople',
      'basicService.isClosed'
    ])
    basicServiceToUpdate.merge(basicService)
    await basicServiceToUpdate.save()
    response.status(200).json(basicServiceToUpdate)
  }

  /**
   * @swagger
   * /basic-services/{basicServiceId}:
   *   delete:
   *     summary: rest api to delete an basic service
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: basicServiceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the basic service to delete
   *     responses:
   *       200:
   *         description: deleted basic service
   *         schema:
   *           $ref: '#/definitions/BasicService'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async destroy({ params, response }) {
    const basicServiceToDelete = await BasicService.findOrFail(params.id)
    await basicServiceToDelete.delete()
    response.status(200).json(basicServiceToDelete)
  }

  /**
   * @swagger
   * /basic-services/{basicServiceId}/subscribe:
   *   post:
   *     summary: rest api to subscribe to a basic service for current user
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: basicServiceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the basic service to get
   *     responses:
   *       201:
   *         description: subscribe to a basicService
   *         schema:
   *           $ref: '#/definitions/BasicServiceSubscriber'
   *       500:
   *         description: server error
   */
  async subscribe({ params, auth, response }) {
    const basicService = await BasicService.findOrFail(params.id)
    const currentUser = await auth.getUser()
    const basicServiceSubscriber = await currentUser
      .basicServiceSubscribers()
      .create({
        basicServiceId: basicService.id
      })

    response.status(201).json(basicServiceSubscriber)
  }

  /**
   * @swagger
   * /basic-services/{basicServiceId}/unsubscribe:
   *   post:
   *     summary: rest api to unsubscribe to a basic service for current user
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: basicServiceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the basic service to get
   *     responses:
   *       201:
   *         description: unsubscribe to a basicService
   *         schema:
   *           $ref: '#/definitions/BasicServiceSubscriber'
   *       500:
   *         description: server error
   */
  async unsubscribe({ params, auth, response }) {
    const basicService = await BasicService.findOrFail(params.id)
    const currentUser = await auth.getUser()
    await currentUser
      .basicServiceSubscribers()
      .where('basicServiceId', basicService.id)
      .delete()

    response.status(201).json(basicService)
  }
}

module.exports = BasicServiceController
