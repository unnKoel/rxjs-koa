import { DefaultState, Middleware } from 'koa'
import { Observable, Subject, from } from 'rxjs'
import { mergeAll } from 'rxjs/operators'
import { ContextExtendProperties, KoaContext } from './model'

export interface Controller {
  (rootObservable: Observable<KoaContext>): Observable<unknown>
}

const createKoaRxjsMiddleware = (
  controller: Controller,
): Middleware<DefaultState, ContextExtendProperties> => {
  const rootSubject = new Subject<KoaContext>()

  const koaRxjsMiddleware: Middleware<
    DefaultState,
    ContextExtendProperties
  > = async (ctx, next) => {
    await new Promise((resolve, reject) => {
      controller(rootSubject.asObservable()).subscribe({
        next: resolve,
        error: reject,
      })
      rootSubject.next({ ctx, next })
    }).then(next)
  }

  return koaRxjsMiddleware
}

export const composeControllers =
  (...controllers: Controller[]) =>
  (rootObservable: Observable<KoaContext>) => {
    const controllerObservables = controllers.map((controller) =>
      controller(rootObservable),
    )

    return from(controllerObservables).pipe(mergeAll())
  }

export default createKoaRxjsMiddleware
