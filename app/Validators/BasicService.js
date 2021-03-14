'use strict'

class BasicService {
  get rules() {
    return {
      'basicService.startAt': 'required|string',
      'basicService.endAt': 'required|string',
      'basicService.maxPeople': 'required|number',
      'basicService.isClosed': 'required|boolean'
    }
  }
}

module.exports = StoreBasicService
