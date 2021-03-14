"use strict";

const Model = use("Model");

/**
 *  @swagger
 *  definitions:
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        content:
 *          type: string
 *        title:
 *          type: string
 *        isForVolunteers:
 *          type: boolean
 *        userId:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *      required:
 *        - content
 *        - title
 *        - isForVolunteers
 *        - userId
 */
class Post extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Post;
