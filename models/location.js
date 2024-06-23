import mongoose from 'mongoose'
const { Schema } = mongoose

const locationSchema = new Schema({
    latitude: Number,
    longitude: Number,
})

export default mongoose.model('Location', locationSchema)