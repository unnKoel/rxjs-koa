import { DefaultContext, DefaultState, Next, ParameterizedContext } from 'koa'

export interface ContextExtendProperties extends DefaultContext {
  params?: Record<string, string>
  succeed: (...args: Array<object | string>) => Ctx
  fail: (...args: Array<object | string>) => Ctx
  respondWith: (code: string | number, ...args: Array<object | string>) => Ctx
}

export type Ctx = ParameterizedContext<
  DefaultState,
  ContextExtendProperties,
  unknown
>

export interface KoaContext {
  ctx: Ctx
  next?: Next
}

export interface User {
  name: string
  email?: string
  password: string
}
