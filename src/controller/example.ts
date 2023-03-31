import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import { KoaContext } from '../model'
import route, { Method } from '../route-operator'

const exampleController: Controller = (
  rootObservable: Observable<KoaContext>,
) => {
  return rootObservable.pipe(
    route('/rxjs', Method.Get),
    map(({ ctx }) => {
      ctx.body = 'hello rxjs'
      return ctx
    }),
  )
}

export default exampleController
