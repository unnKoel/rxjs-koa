import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Controller } from '../koa-rxjs'
import { KoaContext } from '../model'
import route, { Method } from '../operators/route-operator'
import { service } from '../operators/mvc-operator'
import authenticate from '../operators/auth-operator'

export const authController: Controller = (
  rootObservable: Observable<KoaContext>,
) => {
  return rootObservable.pipe(
    route('/auth', Method.Get),
    authenticate(),
    service((serviceObservable) =>
      serviceObservable.pipe(map(({ ctx }) => ctx.succeed())),
    ),
  )
}
