'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('login', 'UserController.login').validator('Login')
Route.post('signup', 'UserController.signup')
  .validator('Signup')
  .middleware(['auth:jwt', 'role:volunteer'])
Route.post('forgotten-password', 'UserController.forgottenPassword').validator(
  'ForgottenPassword'
)
Route.post('reset-password', 'UserController.resetPassword').validator(
  'ResetPassword'
)

Route.get('whoami', 'UserController.whoami').middleware(['auth:jwt'])
Route.resource('basic-services', 'BasicServiceController')
  .middleware(
    new Map([
      [['store'], ['auth:jwt', 'role:volunteer']],
      [['update'], ['auth:jwt', 'role:volunteer']],
      [['destroy'], ['auth:jwt', 'role:volunteer']],
      [['index'], ['auth:jwt']],
      [['show'], ['auth:jwt']]
    ])
  )
  .validator(
    new Map([
      [['basicService.store'], ['BasicService']],
      [['basicService.update'], ['BasicService']]
    ])
  )
Route.resource('posts', 'PostController')
  .middleware(
    new Map([
      [['store'], ['auth:jwt', 'role:volunteer']],
      [['update'], ['auth:jwt', 'role:volunteer']],
      [['destroy'], ['auth:jwt', 'role:volunteer']],
      [['index'], ['auth:jwt']],
      [['show'], ['auth:jwt']]
    ])
  )
  .validator(
    new Map([
      [['post.store'], ['Post']],
      [['post.update'], ['Post']]
    ])
  )
Route.post(
  'basic-services/:id/subscribe',
  'BasicServiceController.subscribe'
).middleware(['auth:jwt'])
Route.post(
  'basic-services/:id/unsubscribe',
  'BasicServiceController.unsubscribe'
).middleware(['auth:jwt'])
Route.resource('events', 'EventController')
  .middleware(
    new Map([
      [['store'], ['auth:jwt', 'role:volunteer']],
      [['update'], ['auth:jwt', 'role:volunteer']],
      [['destroy'], ['auth:jwt', 'role:volunteer']],
      [['index'], ['auth:jwt']],
      [['show'], ['auth:jwt']]
    ])
  )
  .validator(
    new Map([
      [['event.store'], ['Event']],
      [['event.update'], ['Event']]
    ])
  )
