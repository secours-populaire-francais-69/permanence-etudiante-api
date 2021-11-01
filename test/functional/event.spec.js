const { test, trait, beforeEach } = use('Test/Suite')('Event')
const Event = use('App/Models/Event')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

let user
let volunteer

beforeEach(async () => {
  user = await Factory.model('App/Models/User').create()
  volunteer = await Factory.model('App/Models/User').create({
    isVolunteer: true
  })
})

test('when not auth client get 401 when trying to get list of events', async ({
  client
}) => {
  await Factory.model('App/Models/Event').create()
  const response = await client.get('/events').end()

  response.assertStatus(401)
})

test('get list of events', async ({ client, assert }) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client.get('/events').loginVia(user).end()

  response.assertStatus(200)
  assert.equal(response.body[0].isClosed, event.isClosed)
  assert.equal(response.body[0].isChargeable, event.isChargeable)
  assert.equal(response.body[0].maxPeople, event.maxPeople)
  assert.equal(response.body[0].title, event.title)
  assert.equal(response.body[0].comment, event.comment)
  assert.equal(Date(response.body[0].startAt), Date(event.startAt))
  assert.equal(Date(response.body[0].endAt), Date(event.endAt))
})

test('when not auth client get 401 when trying to get detail of a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client.get(`/events/${event.id}`).end()

  response.assertStatus(401)
})

test('get detail of a event', async ({ client, assert }) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client.get(`/events/${event.id}`).loginVia(user).end()

  response.assertStatus(200)
  assert.equal(response.body.isClosed, event.isClosed)
  assert.equal(response.body.isChargeable, event.isChargeable)
  assert.equal(response.body.maxPeople, event.maxPeople)
  assert.equal(response.body.title, event.title)
  assert.equal(response.body.comment, event.comment)
  assert.equal(Date(response.body.startAt), Date(event.startAt))
  assert.equal(Date(response.body.endAt), Date(event.endAt))
})

test('when not auth client get 401 when trying to create a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').make()
  const response = await client.post('/events').send({ event }).end()

  response.assertStatus(401)
})

test('when auth as student you should get 401 when trying to create a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').make()
  const response = await client
    .post('/events')
    .send({ event })
    .loginVia(user)
    .end()

  response.assertStatus(401)
})

test('create a event as volunteer', async ({ client, assert }) => {
  const event = await Factory.model('App/Models/Event').make()
  const response = await client
    .post('/events')
    .send({ event })
    .loginVia(volunteer)
    .end()

  response.assertStatus(201)
  assert.equal(response.body.isClosed, event.isClosed)
  assert.equal(response.body.isChargeable, event.isChargeable)
  assert.equal(response.body.maxPeople, event.maxPeople)
  assert.equal(response.body.title, event.title)
  assert.equal(response.body.comment, event.comment)
  assert.equal(Date(response.body.startAt), Date(event.startAt))
  assert.equal(Date(response.body.endAt), Date(event.endAt))
})

test('when not auth client get 401 when trying to update a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client
    .put(`/events/${event.id}`)
    .send({ event: { title: 'whatever' } })
    .end()

  response.assertStatus(401)
})

test('when not auth as student you should get 401 when trying to update a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client
    .put(`/events/${event.id}`)
    .send({ event: { title: 'whatever' } })
    .loginVia(user)
    .end()

  response.assertStatus(401)
})

test('update an basic-service as volunteer', async ({ client, assert }) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client
    .put(`/events/${event.id}`)
    .send({ event: { title: 'whatever' } })
    .loginVia(volunteer)
    .end()

  response.assertStatus(200)
  assert.equal(response.body.isClosed, event.isClosed)
  assert.equal(response.body.isChargeable, event.isChargeable)
  assert.equal(response.body.maxPeople, event.maxPeople)
  assert.equal(response.body.title, 'whatever')
  assert.equal(response.body.comment, event.comment)
  assert.equal(Date(response.body.startAt), Date(event.startAt))
  assert.equal(Date(response.body.endAt), Date(event.endAt))
})

test('when not auth client get 401 when trying to delete a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client.delete(`/events/${event.id}`).end()

  response.assertStatus(401)
})

test('when auth as student you should get 401 when trying to delete a event', async ({
  client
}) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client
    .delete(`/events/${event.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(401)
})

test('delete a event as volunteer', async ({ client, assert }) => {
  const event = await Factory.model('App/Models/Event').create()
  const response = await client
    .delete(`/events/${event.id}`)
    .loginVia(volunteer)
    .end()

  response.assertStatus(200)
  assert.equal(response.body.isClosed, event.isClosed)
  assert.equal(response.body.isChargeable, event.isChargeable)
  assert.equal(response.body.maxPeople, event.maxPeople)
  assert.equal(response.body.title, event.title)
  assert.equal(response.body.comment, event.comment)
  assert.equal(Date(response.body.startAt), Date(event.startAt))
  assert.equal(Date(response.body.endAt), Date(event.endAt))
  const deletedEvent = await Event.find(event.id)

  assert.equal(deletedEvent, null)
})
