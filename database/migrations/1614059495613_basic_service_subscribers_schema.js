'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BasicServiceSubscribersSchema extends Schema {
  up() {
    this.create('basic_service_subscribers', (table) => {
      table.integer('userId').unsigned().references('id').inTable('users')
      table
        .integer('basicServiceId')
        .unsigned()
        .references('id')
        .inTable('basic_services')
      table.increments()
      table.timestamps()
    })
  }

  down() {
    this.drop('basic_service_subscribers')
  }
}

module.exports = BasicServiceSubscribersSchema
