import Application, { Middleware } from 'koa'
import { Observable, Subject } from 'rxjs'

export interface Controller {
  (
    rootObservable: Observable<Application.ParameterizedContext>,
  ): Observable<unknown>
}

const createKoaRxjsMiddleware = (controller: Controller): Middleware => {
  const rootSubject = new Subject<Application.ParameterizedContext>()

  const koaRxjsMiddleware: Middleware = async (ctx, next) => {
    await new Promise((resolve, reject) => {
      controller(rootSubject.asObservable()).subscribe(resolve, reject)
      rootSubject.next(ctx)
    }).then(next)
  }

  return koaRxjsMiddleware
}

export default createKoaRxjsMiddleware
