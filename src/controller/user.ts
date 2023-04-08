import { Observable, from } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import bcrypt from 'bcryptjs'
import { composeControllers, Controller } from '../koa-rxjs'
import { KoaContext, User } from '../model'
import route, { Method } from '../operators/route-operator'
import userModel from '../db/models/user'
import { generateToken } from '../operators/auth-operator'
import async from '../operators/async-operator'

const register: Controller = (rootObservable: Observable<KoaContext>) => {
  return rootObservable.pipe(
    route('/register', Method.Post),
    async(async ({ ctx }) => {
      const { name, password, email } = ctx.request.body as User
      const oldUser = await userModel.findOne({ email })
      if (oldUser) {
        return ctx.fail(undefined, 'User Already Exist. Please Login')
      }

      await userModel.addUser({ name, password, email })
      const token = generateToken(
        { name, email },
        {
          expiresIn: '2h',
        },
      )

      return ctx.succeed({ name, email, token })
    }),
    map(({ ctx }) => {
      console.log('ctx', ctx.body)
    }),
  )
}

const login: Controller = (rootObservable: Observable<KoaContext>) => {
  return rootObservable.pipe(
    route('/login', Method.Post),
    mergeMap(({ ctx }) =>
      from(
        (async ({ ctx }) => {
          const { email, password } = ctx.request.body as User
          const user = await userModel.findOne({ email })
          if (!user || !bcrypt.compareSync(password, user.password)) {
            return ctx.throw(401)
          }

          const token = generateToken(
            { name: user.name, email },
            {
              expiresIn: '2h',
            },
          )

          return ctx.succeed({ name: user.name, email: user.email, token })
        })({ ctx }),
      ),
    ),
  )
}

export default composeControllers(register, login)
