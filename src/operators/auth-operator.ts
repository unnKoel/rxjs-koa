import { Observable } from 'rxjs'
import { Ctx } from '../model'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import config from '../config'

const authenticate = () => (observable: Observable<Ctx>) => {
  return new Observable<Ctx>((subscriber) => {
    const subscription = observable.subscribe({
      async next(ctx) {
        // token format: `authorization: Bearer <token>`
        let token = ctx.req.headers.authorization
        token = token?.split(' ')[1]?.trim()

        if (!token) {
          subscriber.error(createError(403))
          return
        }

        try {
          const decoded = jwt.verify(token, config.token_key)
          ctx.user = decoded
          subscriber.next(ctx)
        } catch (err) {
          subscriber.error(createError(403, 'Invalid Token'))
        }
      },
      error: subscriber.error,
      complete: subscriber.complete,
    })

    return () => {
      subscription.unsubscribe()
    }
  })
}

export const generateToken = (
  payload: string | object | Buffer,
  options?: jwt.SignOptions | undefined,
): string => jwt.sign(payload, config.token_key, options)

export default authenticate
