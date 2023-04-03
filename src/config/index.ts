import development from './env.dev'
import production from './env.prod'

export default {
  development,
  production,
}[process.env.NODE_ENV ?? 'development']
