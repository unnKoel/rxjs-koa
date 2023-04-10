import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import bcrypt from 'bcryptjs'
import { composeControllers, Controller } from '../koa-rxjs'
import { KoaContext, User } from '../model'
import route, { Method } from '../operators/route-operator'
import userModel from '../db/models/user'
import { generateToken } from '../operators/auth-operator'
import { service, model } from '../operators/mvc-operator'

// const register: Controller = (controllerObservable: Observable<KoaContext>) => {
//   return controllerObservable.pipe(
//     route('/register', Method.Post),
//     service((serviceObservable) => {
//       serviceObservable.pipe(
//         model(async ({ ctx }) => {
//           const { email } = ctx.request.body as User
//           ctx.user = await userModel.findOne({ email })

//           return { ctx }
//         }),
//         map(() => {

//         })
//       )
//       const { name, password, email } = ctx.request.body as User
//       const oldUser = await userModel.findOne({ email })
//       if (oldUser) {
//         return ctx.fail(undefined, 'User Already Exist. Please Login')
//       }

//       await userModel.addUser({ name, password, email })
//       const token = generateToken(
//         { name, email },
//         {
//           expiresIn: '2h',
//         },
//       )

//       return ctx.succeed({ name, email, token })
//     }),
//   )
// }

const login: Controller = (controllerObservable: Observable<KoaContext>) => {
  return controllerObservable.pipe(
    route('/login', Method.Post),
    service((serviceObservable) =>
      serviceObservable.pipe(
        model(async ({ ctx }) => {
          const { email } = ctx.request.body as User
          ctx.user = await userModel.findOne({ email })

          return { ctx }
        }),
        map(({ ctx }) => {
          const { email, password } = ctx.request.body as User
          const { user } = ctx
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
        }),
      ),
    ),
  )
}

export default composeControllers(login)
