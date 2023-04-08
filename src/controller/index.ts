import userController from './user'
import { authController } from './auth'
import { composeControllers } from '../koa-rxjs'

export default composeControllers(userController, authController)
