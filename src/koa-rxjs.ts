import { DefaultState, Middleware } from 'koa'
import { Observable, Subject, from } from 'rxjs'
import { mergeAll, first } from 'rxjs/operators'
import { ContextExtendProperties, Ctx } from './model'

export interface Controller {
  (rootObservable: Observable<Ctx>): Observable<unknown>
}

const createKoaRxjsMiddleware = (
  controller: Controller,
): Middleware<DefaultState, ContextExtendProperties> => {
  const rootSubject = new Subject<Ctx>()

  const rootControllerObservable = controller(rootSubject.asObservable())

  const koaRxjsMiddleware: Middleware<
    DefaultState,
    ContextExtendProperties
  > = async (ctx, next) => {
    await new Promise((resolve, reject) => {
      rootControllerObservable.pipe(first()).subscribe({
        next: resolve,
        error: reject,
      })
      rootSubject.next(ctx)
    }).then(next)
  }

  return koaRxjsMiddleware
}

export const composeControllers =
  (...controllers: Controller[]) =>
  (rootObservable: Observable<Ctx>) => {
    const controllerObservables = controllers.map((controller) =>
      controller(rootObservable),
    )

    return from(controllerObservables).pipe(mergeAll())
  }

export default createKoaRxjsMiddleware
