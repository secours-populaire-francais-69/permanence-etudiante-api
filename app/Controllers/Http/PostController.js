"use strict";

const Post = use("App/Models/Post");

class PostController {
  /**
   * @swagger
   * /posts:
   *   get:
   *     summary: rest api to list posts
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: list posts
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Post'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async index({ response }) {
    const posts = await Post.all();
    response.status(200).json(posts);
  }

  /**
   * @swagger
   * /posts:
   *   post:
   *     summary: rest api to create a post
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: post
   *         description: Post object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             post:
   *               type: object
   *               properties:
   *                 content:
   *                   type: string
   *                 title:
   *                   type: string
   *                 isForVolunteers:
   *                   type: boolean
   *     responses:
   *       201:
   *         description: create a post
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Post'
   *       400:
   *         description: missing params
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async store({ request, response, auth }) {
    const { post } = request.only([
      "post.content",
      "post.title",
      "post.isForVolunteers",
    ]);
    const currentUser = await auth.getUser();
    const createdPost = await currentUser.posts().create(post);
    response.status(201).json(createdPost);
  }

  /**
   * @swagger
   * /posts/{postId}:
   *   get:
   *     summary: rest api to get details of a post
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the post to get
   *     responses:
   *       200:
   *         description: get a post
   *         schema:
   *           $ref: '#/definitions/Post'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async show({ params, response }) {
    const post = await Post.findOrFail(params.id);
    response.status(200).json(post);
  }

  /**
   * @swagger
   * /posts/{postId}:
   *   put:
   *     summary: rest api to update a post
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the post to update
   *       - name: post
   *         description: post object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           type: object
   *           properties:
   *             post:
   *               type: object
   *               properties:
   *                 content:
   *                   type: string
   *                 title:
   *                   type: string
   *                 isForVolunteers:
   *                   type: boolean
   *     responses:
   *       200:
   *         description: updated post
   *         schema:
   *           $ref: '#/definitions/Post'
   *       400:
   *         description: missing params
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async update({ params, request, response }) {
    const postToUpdate = await Post.findOrFail(params.id);
    const { post } = request.only([
      "post.content",
      "post.title",
      "post.isForVolunteers",
    ]);
    postToUpdate.merge(post);
    await postToUpdate.save();
    response.status(200).json(postToUpdate);
  }

  /**
   * @swagger
   * /posts/{postId}:
   *   delete:
   *     summary: rest api to delete a post
   *     security:
   *       - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the post to delete
   *     responses:
   *       200:
   *         description: deleted post
   *         schema:
   *           $ref: '#/definitions/Post'
   *       401:
   *         description: User is not connected
   *       500:
   *         description: server error
   */
  async destroy({ params, response }) {
    const postToDelete = await Post.findOrFail(params.id);
    await postToDelete.delete();
    response.status(200).json(postToDelete);
  }
}

module.exports = PostController;
