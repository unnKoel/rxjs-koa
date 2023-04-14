import { map } from 'rxjs/operators'
import bcrypt from 'bcryptjs'
import { User, Ctx } from '../model'
import userModel from '../db/models/user'
import { mergeMapFrom } from '../operators/mvc-operator'
import { generateToken } from '../operators/auth-operator'

export const userHasExist = mergeMapFrom<Ctx>(async (ctx) => {
  const { email } = ctx.request.body as User
  const oldUser = await userModel.findOne({ email })
  if (oldUser) {
    return ctx.fail('User Already Exist. Please Login')
  }

  return ctx
})

export const addNewUser = mergeMapFrom<Ctx>(async (ctx) => {
  const { name, password, email } = ctx
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(password, salt)
  await userModel.create({ name, email, password: hash })
  return ctx
})

export const createToken = map<Ctx, Ctx>((ctx) => {
  const { name, email } = ctx
  const token = generateToken(
    { name, email },
    {
      expiresIn: '2h',
    },
  )

  return ctx.succeed({ name, email, token })
})
