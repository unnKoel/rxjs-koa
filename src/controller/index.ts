import Application from 'koa'
import { Observable, map } from 'rxjs'
import { Controller } from '../koa-rxjs'

const rootController: Controller = (
  rootObservable: Observable<Application.ParameterizedContext>,
) => {
  return rootObservable.pipe(
    map((ctx) => {
      console.log(ctx.URL)
      return ctx
    }),
  )
}

export default rootController
