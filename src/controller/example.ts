import Application from 'koa'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'

const exampleController: Controller = (
  rootObservable: Observable<Application.ParameterizedContext>,
) => {
  return rootObservable.pipe(
    filter((ctx) => ctx.path === '/rxjs'),
    map((ctx) => {
      ctx.body = 'hello rxjs'
      return ctx
    }),
  )
}

export default exampleController
