import { Observable } from 'rxjs'
// import { map } from 'rxjs/operators'
import bcrypt from 'bcryptjs'
import { composeControllers, Controller } from '../koa-rxjs'
import { KoaContext, User } from '../model'
import route, { Method } from '../operators/route-operator'
import userModel from '../db/models/user'
import { generateToken } from '../operators/auth-operator'
import { service, mergeMapFrom } from '../operators/mvc-operator'
import { userHasExist, addNewUser, createToken } from '../service/user.service'

const register: Controller = (controllerObservable: Observable<KoaContext>) => {
  return controllerObservable.pipe(
    route('/register', Method.Post),
    service((serviceObservable) =>
      serviceObservable.pipe(userHasExist, addNewUser, createToken),
    ),
  )
}

const login: Controller = (controllerObservable: Observable<KoaContext>) => {
  return controllerObservable.pipe(
    route('/login', Method.Post),
    service((serviceObservable) =>
      serviceObservable.pipe(
        mergeMapFrom(async ({ ctx }) => {
          const { email, password } = ctx.request.body as User
          ctx.user = await userModel.findOne({ email })
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

export default composeControllers(register, login)
