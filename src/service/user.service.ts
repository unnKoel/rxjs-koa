import { map } from 'rxjs/operators'
import bcrypt from 'bcryptjs'
import { User, KoaContext } from '../model'
import userModel from '../db/models/user'
import { mergeMapFrom } from '../operators/mvc-operator'
import { generateToken } from '../operators/auth-operator'

export const userHasExist = mergeMapFrom<KoaContext>(async ({ ctx, next }) => {
  const { email } = ctx.request.body as User
  const oldUser = await userModel.findOne({ email })
  if (oldUser) {
    return ctx.fail(undefined, 'User Already Exist. Please Login')
  }

  return { ctx, next }
})

export const addNewUser = mergeMapFrom<KoaContext>(async ({ ctx, next }) => {
  const { name, password, email } = ctx
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(password, salt)
  await userModel.create({ name, email, password: hash })
  return { ctx, next }
})

export const createToken = map(({ ctx, next }) => {
  const { name, email } = ctx
  const token = generateToken(
    { name, email },
    {
      expiresIn: '2h',
    },
  )

  return ctx.succeed({ name, email, token })
})
