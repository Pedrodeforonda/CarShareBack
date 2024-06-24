import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authController from '../CarShareBack/controllers/authController.js';
import carController from '../CarShareBack/controllers/carController.js';

dotenv.config()

import MqttHandler from './mqtt/mqtt_handler.js'
import { router } from './routes/session_route.js'
import userController from "./controllers/userController.js";

const mqtt_handle = new MqttHandler()
mqtt_handle.connect()

const app = express()
app.use(express.json())
app.use(cors())
app.use(router)
app.use('/auth', authController);
app.use('/car', carController);
app.use('/user', userController)

const start = async () => {
    try {
        const connectionString = `mongodb://${process.env.MONGO_URL}:27017/carshare`;
        console.log('Connection string: ', connectionString.replace(process.env.MONGO_USER, '****').replace(process.env.MONGO_PASS, '****'));
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error.message);
    }

    app.listen(3001, () => {
        console.log('Server running on port 3001');
    });
}

start();