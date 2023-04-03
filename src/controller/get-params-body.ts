import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import { KoaContext } from '../model'
import route, { Method } from '../route-operator'

const exampleBodyController: Controller = (
  rootObservable: Observable<KoaContext>,
) => {
  return rootObservable.pipe(
    route('/body-example', Method.Post),
    map(({ ctx }) => {
      ctx.body = {
        topic: 'rjxs',
        content: ctx.request.body,
      }
      return ctx
    }),
  )
}

export default exampleBodyController
