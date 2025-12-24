/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
// import { messageMeThrottle } from '#start/limiter'
const IndexController = () => import('#controllers/index_controller')

router.get('/', [IndexController, 'renderHome'])

router.post('/contact', [IndexController, 'contact'])
// .use(messageMeThrottle)
