import Application from 'koa'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import route from '../route-operator'

const exampleController2: Controller = (
  rootObservable: Observable<Application.ParameterizedContext>,
) => {
  return rootObservable.pipe(
    route('/koa', 'get'),
    map((ctx) => {
      ctx.body = 'hello koa'
      return ctx
    }),
  )
}

export default exampleController2
