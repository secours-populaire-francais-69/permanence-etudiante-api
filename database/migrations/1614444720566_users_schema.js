"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.string("resetPasswordToken").nullable();
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("resetPasswordToken");
    });
  }
}

module.exports = UsersSchema;
