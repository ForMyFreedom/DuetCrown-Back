/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.post('/register', 'UsersController.store')
  Route.post('/login', 'UsersController.login')
  Route.get('/blankChar', 'UsersController.blankChar')
})

Route.group(() => {
  Route.resource('/character', 'UsersController').only(['update'])
  Route.get('/character/all/:id', 'UsersController.allCharacters')
  Route.get('/character/recent/:id', 'UsersController.recentCharacter')
  Route.delete('/character/rollback/:id', 'UsersController.rollbackCharacter')

  Route.resource('/moviment', 'CommumMovimentsController').only(['index'])
  Route.get('/verify-connections', 'ConnectionsController.verify')
  Route.delete('/destroy-connection', 'ConnectionsController.destroy')
}).middleware('auth')
