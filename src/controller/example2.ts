import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import { KoaContext } from '../model'
import route, { Method } from '../route-operator'

const exampleController2: Controller = (
  rootObservable: Observable<KoaContext>,
) => {
  return rootObservable.pipe(
    route('/koa/:id?', Method.Get),
    map(({ ctx }) => {
      ctx.body = `hello koa ${ctx.params!.id}`
      return ctx
    }),
  )
}

export default exampleController2
