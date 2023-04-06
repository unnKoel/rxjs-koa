import Application, { DefaultContext, DefaultState } from 'koa'

export type ParameterizedContextExtendsParams<
  StateT = DefaultState,
  ContextT = DefaultContext,
  ResponseBodyT = unknown,
> = Application.ParameterizedContext<StateT, ContextT, ResponseBodyT> & {
  params?: Record<string, string>
  succeed: (data?: object, message?: string) => void
  fail: (data?: object, message?: string) => void
  respondWith: (code: string | number, data?: object, message?: string) => void
}

export interface KoaContext<
  StateT = DefaultState,
  ContextT = DefaultContext,
  ResponseBodyT = unknown,
> {
  ctx: ParameterizedContextExtendsParams<StateT, ContextT, ResponseBodyT>
  next: Application.Next
}

export interface User {
  name: string
  email?: string
  password: string
}
