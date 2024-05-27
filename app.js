import express from 'express'
import mongoose from 'mongoose'
import User from './models/user.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())



const start = async () => {
  try {
    await mongoose.connect(
        'mongodb://localhost:27017/carshare?authSource=admin',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
    )
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error.message)
  }

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
}

start().then(() => {
    const user = new User({ email: "hol", name: "name", password: "hola" })
    user.save()
})