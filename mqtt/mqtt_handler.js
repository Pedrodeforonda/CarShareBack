import mqtt from 'mqtt'
import { appendData, createSession, endSession } from '../services/mqttService.js'
import dotenv from 'dotenv';
dotenv.config()

class MqttHandler {
    constructor() {
        this.mqttClient = null
        this.host = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host)

        this.mqttClient.on('error', (err) => {
            console.log('An error has occured: ', err)
            this.mqttClient.end()
        })

        this.mqttClient.on('connect', () => {
            console.log(`Mqtt client connected`)
        })

        this.mqttClient.subscribe('carshare/inel00/session/#', { qos: 0 })

        this.mqttClient.subscribe('carshare/inel00/01/data/#', { qos: 0 })

        this.mqttClient.on('message', (topic, message) => {
            console.log(`${message} received from topic ${topic}`)
            switch (topic) {
                case 'carshare/inel00/session/start':
                    createSession()
                    return
                case 'carshare/inel00/session/stop':
                    endSession()
                    return
                case 'carshare/inel00/01/data/live':
                    appendData(message)
                    return
            }
        })

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`)
        })
    }
}

export default MqttHandler
