'use strict'

class Event {
  get rules() {
    return {
      'event.startAt': 'required|string',
      'event.endAt': 'required|string',
      'event.maxPeople': 'required|number',
      'event.title': 'required|string',
      'event.comment': 'required|string',
      'event.isFree': 'required|boolean',
      'event.isClosed': 'required|boolean'
    }
  }
}

module.exports = Event
