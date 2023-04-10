import { Observable, from, mergeMap } from 'rxjs'

export const async =
  <Context>(asyncFunc: (context: Context) => Promise<Context>) =>
  (observable: Observable<Context>) => {
    return observable.pipe(mergeMap((context) => from(asyncFunc(context))))
  }

// export const service =
//   <Context>(
//     func: (serviceObservable: Observable<Context>) => Observable<Context>,
//   ) =>
//   (controllerObservable: Observable<Context>) => {
//     // return observable
//   }

export const service = async

// const model = () => {}
