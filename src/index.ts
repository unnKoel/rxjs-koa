import Koa from 'koa'
import createKoaRxjsMiddleware from './koa-rxjs'
import rootController from './controller/index'

const app = new Koa()

app.use(createKoaRxjsMiddleware(rootController))

app.use(async (ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000)
