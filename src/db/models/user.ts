import mongoose from 'mongoose'
// import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    // statics: {
    //   async addUser({ name, email, password }) {
    //     const salt = bcrypt.genSaltSync()
    //     const hash = bcrypt.hashSync(password, salt)
    //     return await this.create({ name, email, password: hash })
    //   },
    // },
  },
)

export default mongoose.model('User', UserSchema)
