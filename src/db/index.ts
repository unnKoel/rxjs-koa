import mongoose from 'mongoose'

export const connect = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url)
    mongoose.connection.on('error', (err) => {
      console.error(err)
    })
  } catch (err) {
    console.error(err)
  }
}
