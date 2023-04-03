import Koa from 'koa'
import logger from 'koa-logger'
import createKoaRxjsMiddleware from './koa-rxjs'
import rootController from './controller/index'
import bodyparser from 'koa-bodyparser'
import { connect } from './db'
import config from './config'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  const app = new Koa()

  app.use(logger())
  app.use(bodyparser())
  app.use(createKoaRxjsMiddleware(rootController))
  await connect(config!.db)

  app.listen(3000)
})()
