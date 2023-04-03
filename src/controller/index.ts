import exampleController from './example'
import exampleController2 from './example2'
import exampleBodyController from './get-params-body'
import { composeControllers } from '../koa-rxjs'

export default composeControllers(
  exampleController,
  exampleController2,
  exampleBodyController,
)
