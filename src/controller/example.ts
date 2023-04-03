import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import { KoaContext } from '../model'
import route, { Method } from '../route-operator'
import user from '../db/models/user'

const exampleController: Controller = (
  rootObservable: Observable<KoaContext>,
) => {
  return rootObservable.pipe(
    route('/rxjs', Method.Get),
    map(async ({ ctx }) => {
      const users = await user.find()
      ctx.body = {
        topic: 'rjxs',
        content: users,
      }
      return ctx
    }),
  )
}

export default exampleController
