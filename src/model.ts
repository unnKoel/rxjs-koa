import { DefaultState, Next, ParameterizedContext } from 'koa'
import { JwtPayload } from 'jsonwebtoken'

export interface ContextExtendProperties {
  params?: Record<string, string>
  user: string | JwtPayload
  succeed: (data?: object, message?: string) => KoaContext
  fail: (data?: object, message?: string) => KoaContext
  respondWith: (
    code: string | number,
    data?: object,
    message?: string,
  ) => KoaContext
}

export interface KoaContext<
  StateT = DefaultState,
  ContextT = ContextExtendProperties,
  ResponseBodyT = unknown,
> {
  ctx: ParameterizedContext<StateT, ContextT, ResponseBodyT>
  next?: Next
}

export interface User {
  name: string
  email?: string
  password: string
}
