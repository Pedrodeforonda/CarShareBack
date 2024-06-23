import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authController from '../CarShareBack/controllers/authController.js';
import carController from '../CarShareBack/controllers/carController.js';


const app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', authController);
app.use('/car', carController);


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

start()
