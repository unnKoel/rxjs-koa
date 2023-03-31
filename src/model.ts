import Application, { DefaultContext, DefaultState } from 'koa'

export type ParameterizedContextExtendsParams<
  StateT = DefaultState,
  ContextT = DefaultContext,
  ResponseBodyT = unknown,
> = Application.ParameterizedContext<StateT, ContextT, ResponseBodyT> & {
  params?: Record<string, string>
}

export interface KoaContext {
  ctx: ParameterizedContextExtendsParams
  next: Application.Next
}
