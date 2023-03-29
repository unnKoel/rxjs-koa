import exampleController from './example'
import exampleController2 from './example2'
import { composeControllers } from '../koa-rxjs'

export default composeControllers(exampleController, exampleController2)
