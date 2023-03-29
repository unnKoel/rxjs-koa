import Application from 'koa'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'

const exampleController2: Controller = (
  rootObservable: Observable<Application.ParameterizedContext>,
) => {
  return rootObservable.pipe(
    filter((ctx) => ctx.path === '/koa'),
    map((ctx) => {
      ctx.body = 'hello koa'
      return ctx
    }),
  )
}

export default exampleController2
