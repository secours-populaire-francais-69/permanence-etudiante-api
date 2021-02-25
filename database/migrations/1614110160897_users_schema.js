"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.dropColumn("username");
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("popAcceuilNumber").notNullable();
      table.boolean("isVolunteer").notNullable();
      table.boolean("isAdmin").notNullable();
    });
  }

  down() {
    this.table("users", (table) => {
      table.string("username", 80).notNullable();
      table.dropColumn("firstName");
      table.dropColumn("lastName");
      table.dropColumn("popAcceuilNumber");
      table.dropColumn("isVolunteer");
      table.dropColumn("isAdmin");
    });
  }
}

module.exports = UsersSchema;
