const { test, trait } = use('Test/Suite')('User')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('login should return token infos when succeed', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('/login')
    .send({ email: user.email, password: 'password' })
    .end()

  const tokens = await user.tokens().fetch()
  response.assertStatus(201)
  response.assertJSONSubset({
    status: 'success',
    data: {
      type: 'bearer',
      token: tokens.rows[tokens.rows.length - 1].token,
      refreshToken: null
    }
  })
})

test('login should return 401 when wrong credential', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('/login')
    .send({ email: user.email, password: 'password2' })
    .end()

  response.assertStatus(400)
})

test('sign should return 401 when user is not logged in', async ({
  client
}) => {
  const response = await client
    .post('/signup')
    .send({
      firstName: 'jean',
      lastName: 'dujardin',
      email: 'jean@spf.fr',
      popAccueilNumber: '4242',
      isVolunteer: true,
      isAdmin: true,
      password: 'password42'
    })
    .end()

  response.assertStatus(401)
})

test('sign should return 401 when user is logged in as student', async ({
  client
}) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('/signup')
    .send({
      firstName: 'jean',
      lastName: 'dujardin',
      email: 'jean@spf.fr',
      popAccueilNumber: '4242',
      isVolunteer: true,
      isAdmin: true,
      password: 'password42'
    })
    .loginVia(user)
    .end()

  response.assertStatus(401)
})

test('when volunteer is logged in sign should return token infos when succeed and create the user', async ({
  client
}) => {
  const volunteer = await Factory.model('App/Models/User').create({
    isVolunteer: true
  })
  const response = await client
    .post('/signup')
    .send({
      firstName: 'jean',
      lastName: 'dujardin',
      email: 'jean@spf.fr',
      popAccueilNumber: '4242',
      isVolunteer: true,
      isAdmin: true,
      password: 'password42'
    })
    .loginVia(volunteer)
    .end()

  const user = await User.findBy('email', 'jean@spf.fr')
  const tokens = await user.tokens().fetch()
  response.assertStatus(201)
  response.assertJSONSubset({
    status: 'success',
    data: {
      type: 'bearer',
      token: tokens.rows[tokens.rows.length - 1].token,
      refreshToken: null
    }
  })
})

test('login should return 401 when wrong credential', async ({ client }) => {
  const response = await client.post('/signup').send({ email: 'ladf' }).end()

  response.assertStatus(400)
})

test('when not auth client get 401 when trying to get whoami', async ({
  client
}) => {
  await Factory.model('App/Models/User').create()
  const response = await client.get(`/whoami`).end()

  response.assertStatus(401)
})

test('get detail of a whoami', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client.get(`whoami`).loginVia(user).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    username: user.username,
    email: user.email
  })
})

test('send reset password mail', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('forgotten-password')
    .send({
      forgottenPassword: {
        email: user.email
      }
    })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    status: 'success'
  })
  await user.reload()
  assert.isNotNull(user.resetPasswordToken)
})

test('fake send reset password mail when user is not found', async ({
  client,
  assert
}) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('forgotten-password')
    .send({
      forgottenPassword: {
        email: `whatever${user.email}`
      }
    })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    status: 'success'
  })
  await user.reload()
  assert.equal(user.resetPasswordToken, null)
})

test('reset password', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const resetPasswordToken = user.generatePasswordToken()
  user.resetPasswordToken = resetPasswordToken
  await user.save()
  const response = await client
    .post('reset-password')
    .send({
      resetPassword: {
        resetPasswordToken,
        password: 'whatever'
      }
    })
    .end()

  const tokens = await user.tokens().fetch()
  response.assertStatus(201)
  response.assertJSONSubset({
    status: 'success',
    data: {
      type: 'bearer',
      token: tokens.rows[tokens.rows.length - 1].token,
      refreshToken: null
    }
  })
  await user.reload()
  assert.equal(user.resetPasswordToken, null)
})

test('reset password with wrong params', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const resetPasswordToken = user.generatePasswordToken()
  user.resetPasswordToken = resetPasswordToken
  await user.save()
  const response = await client
    .post('reset-password')
    .send({
      resetPassword: {
        resetPasswordToken: 'wrongtoken',
        password: 'whatever'
      }
    })
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    status: 'error',
    message: 'Invalid reset password'
  })
  await user.reload()
  assert.isNotNull(user.resetPasswordToken)
})
