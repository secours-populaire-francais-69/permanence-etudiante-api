'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up() {
    this.create('events', (table) => {
      table.increments()
      table.date('startAt').notNullable()
      table.date('endAt').notNullable()
      table.integer('maxPeople')
      table.string('title').notNullable()
      table.text('comment').notNullable()
      table.boolean('isChargeable').notNullable().defaultTo(true)
      table.boolean('isClosed').notNullable().defaultTo(false)
      table.timestamps()
    })
  }

  down() {
    this.drop('events')
  }
}

module.exports = EventsSchema
