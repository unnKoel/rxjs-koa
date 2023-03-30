import Application from 'koa'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import route from '../route-operator'

const exampleController: Controller = (
  rootObservable: Observable<Application.ParameterizedContext>,
) => {
  return rootObservable.pipe(
    route('/rxjs', 'get'),
    map((ctx) => {
      ctx.body = 'hello rxjs'
      return ctx
    }),
  )
}

export default exampleController
