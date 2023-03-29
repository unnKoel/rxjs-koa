import Application, { Middleware } from 'koa'
import { Observable, Subject, from } from 'rxjs'
import { mergeAll } from 'rxjs/operators'

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

export const composeControllers =
  (...controllers: Controller[]) =>
  (rootObservable: Observable<Application.ParameterizedContext>) => {
    const controllerObservables = controllers.map((controller) =>
      controller(rootObservable),
    )

    return from(controllerObservables).pipe(mergeAll())
  }

export default createKoaRxjsMiddleware
