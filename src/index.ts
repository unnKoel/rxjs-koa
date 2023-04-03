import Koa from 'koa'
import createKoaRxjsMiddleware from './koa-rxjs'
import rootController from './controller/index'
import bodyparser from 'koa-bodyparser'

const app = new Koa()

app.use(bodyparser())
app.use(createKoaRxjsMiddleware(rootController))

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.listen(3000)
