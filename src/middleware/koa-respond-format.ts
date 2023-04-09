import { Middleware } from 'koa'

const respondFormat: (
  succeedCode?: string | number,
  failCode?: string | number,
) => Middleware =
  (succeedCode = 1, failCode = 0) =>
  async (ctx, next) => {
    ctx.succeed = (data?: object, message: string = 'success') => {
      ctx.body = {
        code: succeedCode,
        data,
        message,
      }

      return { ctx, next }
    }

    ctx.fail = (data?: object, message: string = 'failure') => {
      ctx.body = {
        code: failCode,
        data,
        message,
      }

      console.log('ctx1', ctx.body)
      return { ctx, next }
    }

    ctx.respondWith = (
      code: string | number,
      data?: object,
      message?: string,
    ) => {
      ctx.body = {
        code,
        data,
        message,
      }

      return { ctx, next }
    }

    await next()
  }

export default respondFormat
