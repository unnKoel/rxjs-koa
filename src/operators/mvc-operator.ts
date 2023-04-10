import { Observable, from, mergeMap, Subject } from 'rxjs'

export const async =
  <Context>(asyncFunc: (context: Context) => Promise<Context>) =>
  (observable: Observable<Context>) => {
    return observable.pipe(mergeMap((context) => from(asyncFunc(context))))
  }

export const service =
  <Context>(
    func: (serviceObservable: Observable<Context>) => Observable<Context>,
  ) =>
  (controllerObservable: Observable<Context>) => {
    const serviceObservable = new Subject<Context>().asObservable()
    return controllerObservable.pipe(mergeMap(() => func(serviceObservable)))
  }

// export const service = async

export const model = async
