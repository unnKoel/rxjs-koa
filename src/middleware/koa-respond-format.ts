import { Middleware } from 'koa'

const responseDataMessage = (
  ...args: Array<object | string>
): { message?: string; data?: object } => {
  const response: { message?: string; data: object } = { data: {} }

  args.slice(0, 2).forEach((value) => {
    if (typeof value === 'string') {
      response.message = value
    } else if (typeof value === 'object') {
      response.data = value
    }
  })

  return response
}

const respondFormat: (
  succeedCode?: string | number,
  failCode?: string | number,
) => Middleware =
  (succeedCode = 1, failCode = 0) =>
  async (ctx, next) => {
    ctx.succeed = (...args: Array<object | string>) => {
      ctx.body = {
        code: succeedCode,
        message: 'success',
        ...responseDataMessage(...args),
      }

      return ctx
    }

    ctx.fail = (...args: Array<object | string>) => {
      ctx.body = {
        code: failCode,
        message: 'failure',
        ...responseDataMessage(...args),
      }

      return ctx
    }

    ctx.respondWith = (
      code: string | number,
      ...args: Array<object | string>
    ) => {
      ctx.body = {
        code,
        message: '',
        ...responseDataMessage(...args),
      }

      return ctx
    }

    await next()
  }

export default respondFormat
