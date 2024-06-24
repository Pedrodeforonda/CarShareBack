import mongoose from 'mongoose'
import User from "./user.js";
import Car from "./car.js";
import Location from "./location.js";
const { Schema } = mongoose

const sessionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: User },
    car: { type: Schema.Types.ObjectId, ref: Car },
    start_time: { type: Date, default: Date.now },
    location: [Location.schema],
    distance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
})

export default mongoose.model('Session', sessionSchema)