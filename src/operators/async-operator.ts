import { Observable, from, mergeMap } from 'rxjs'
import { KoaContext } from '../model'

const async =
  (asyncFunc: (context: KoaContext) => Promise<KoaContext>) =>
  (observable: Observable<KoaContext>) => {
    return observable.pipe(mergeMap(({ ctx }) => from(asyncFunc({ ctx }))))
  }

export default async
