"use strict";

class Post {
  get rules() {
    return {
      "post.content": "required|string",
      "post.title": "required|string",
      "post.isForVolunteers": "required|boolean",
    };
  }
}

module.exports = Post;
