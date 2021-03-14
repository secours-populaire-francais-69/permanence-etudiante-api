"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PostsSchema extends Schema {
  up() {
    this.create("posts", (table) => {
      table.increments();
      table.text("content").notNullable();
      table.string("title").notNullable();
      table.boolean("isForVolunteers").notNullable().defaultTo(false);
      table.integer("userId").unsigned().references("id").inTable("users");
      table.timestamps();
    });
  }

  down() {
    this.drop("posts");
  }
}

module.exports = PostsSchema;
