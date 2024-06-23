import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authController from '../CarShareBack/controllers/authController.js';
import carController from '../CarShareBack/controllers/carController.js';

dotenv.config()

import MqttHandler from './mqtt/mqtt_handler.js'
import { router } from './routes/session_route.js'

const mqtt_handle = new MqttHandler()
mqtt_handle.connect()

const app = express()
app.use(express.json())
app.use(cors())
app.use(router)
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

  app.listen(5000, () => {
    console.log('Server running on port 5000')
  })
}

start()
