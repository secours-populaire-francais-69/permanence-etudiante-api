"use strict";
const User = use("App/Models/User");
const mailer = use("App/Helpers/Mailer");
const Env = use("Env");
const frontUrl = Env.get("FRONT_URL");

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
   *             firstName:
   *               type: string
   *             lastName:
   *               type: string
   *             popAcceuilNumber:
   *               type: string
   *             isVolunteer:
   *               type: boolean
   *             isAdmin:
   *               type: boolean
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

  /**
   * @swagger
   * /whoami:
   *   get:
   *     summary: rest api to get my information
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: user info
   *         schema:
   *           $ref: '#/definitions/User'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async whoami({ auth, response }) {
    const currentUser = await auth.getUser();
    response.status(200).json(currentUser);
  }

  /**
   * @swagger
   * /forgotten-password:
   *   post:
   *     summary: rest api get mail to reset user password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: forgottenPassword
   *         description: object containing forgot password info
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             forgottenPassword:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                   format: email
   *     responses:
   *       201:
   *         description: email has been sent
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *       400:
   *         description: missing params
   *       500:
   *         description: server error
   */
  async forgottenPassword({ request, response }) {
    if (!request.body.forgottenPassword?.email) {
      return response.status(400).json({
        status: "missing params",
      });
    }
    const user = await User.findBy(
      "email",
      request.body.forgottenPassword.email
    );
    if (!user) {
      return response.status(201).json({
        status: "success",
      });
    }
    const resetPasswordToken = await user.generatePasswordToken();
    user.resetPasswordToken = resetPasswordToken;
    await user.save();
    const test = await mailer({
      to: [{ Email: user.email, Name: user.fullName }],
      subjbect: "Réinitialisation de mot de passe",
      templateId: 2526270,
      templateLanguage: true,
      variables: {
        firstName: user.firstName,
        resetPasswordLink: `${frontUrl}/reset-password?token=${resetPasswordToken}`,
      },
    });
    return response.status(201).json({
      status: "success",
    });
  }
}

module.exports = UserController;
