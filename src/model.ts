import { DefaultState, Next, ParameterizedContext } from 'koa'
import { JwtPayload } from 'jsonwebtoken'

export interface ContextExtendProperties {
  params?: Record<string, string>
  user: string | JwtPayload
  succeed: (data?: object, message?: string) => void
  fail: (data?: object, message?: string) => void
  respondWith: (code: string | number, data?: object, message?: string) => void
}

export interface KoaContext<
  StateT = DefaultState,
  ContextT = ContextExtendProperties,
  ResponseBodyT = unknown,
> {
  ctx: ParameterizedContext<StateT, ContextT, ResponseBodyT>
  next: Next
}

export interface User {
  name: string
  email?: string
  password: string
}
