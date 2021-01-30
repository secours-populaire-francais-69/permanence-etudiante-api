"use strict";
const User = use("App/Models/User");

class UserController {
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: rest api to log users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: credential
   *         description: credential object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       201:
   *         description: login info
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               type: string
   *       400:
   *         description: login has failed
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               type: string
   */
  async login({ request, response, auth }) {
    try {
      const user = await User.findByOrFail("email", request.body.email);
      const token = await auth.attempt(
        request.body.email,
        request.body.password
      );
      await user.tokens().create({
        token: token.token,
        type: token.type,
      });
      return response.status(201).json({
        status: "success",
        data: token,
      });
    } catch (error) {
      response.status(400).json({
        status: "error",
        message: "Invalid email/password",
      });
    }
  }

  /**
   * @swagger
   * /signup:
   *   post:
   *     summary: rest api to signup users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         description: User object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             username:
   *               type: string
   *             email:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       201:
   *         description: signup info
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               type: string
   *       400:
   *         description: signup has failed
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             data:
   *               type: string
   */
  async signup({ request, auth, response }) {
    try {
      const user = await User.create(request.body);
      const token = await auth.generate(user);
      await user.tokens().create({
        token: token.token,
        type: token.type,
      });
      return response.status(201).json({
        status: "success",
        data: token,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "There was a problem creating the user, please try again later.",
      });
    }
  }
}

module.exports = UserController;
