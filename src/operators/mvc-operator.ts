import { Observable, from, mergeMap } from 'rxjs'

export const mergeMapFrom =
  <Context>(asyncFunc: (context: Context) => Promise<Context>) =>
  (observable: Observable<Context>) => {
    return observable.pipe(mergeMap((context) => from(asyncFunc(context))))
  }

export const service =
  <Context>(
    func: (serviceObservable: Observable<Context>) => Observable<Context>,
  ) =>
  (observable: Observable<Context>) =>
    func(observable)
