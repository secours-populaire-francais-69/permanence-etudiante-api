'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BasicServicesSchema extends Schema {
  up() {
    this.create('basic_services', (table) => {
      table.increments()
      table.date('startAt').notNullable()
      table.date('endAt').notNullable()
      table.integer('maxPeople')
      table.boolean('isClosed').notNullable().defaultTo(false)
      table.timestamps()
    })
  }

  down() {
    this.drop('basic_services')
  }
}

module.exports = BasicServicesSchema
