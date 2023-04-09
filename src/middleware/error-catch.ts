import { DefaultState, Middleware } from 'koa'
import { SignatureError } from './signature-validate'
import { ContextExtendProperties } from '../model'

const errorCatch =
  (): Middleware<DefaultState, ContextExtendProperties, any> =>
  async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      if (err instanceof SignatureError) {
        return ctx.fail(undefined, err.message)
      }
      throw err
    }
  }

export default errorCatch
