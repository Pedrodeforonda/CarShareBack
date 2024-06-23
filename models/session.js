import mongoose from 'mongoose'
import User from "./user.js";
import Car from "./car.js";
import Location from "./location.js";
const { Schema } = mongoose

const sessionSchema = new Schema({
    name: String,
    user: { type: Schema.Types.ObjectId, ref: User },
    car: { type: Schema.Types.ObjectId, ref: Car },
    location: [Location.schema],
    distance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
})

export default mongoose.model('Session', sessionSchema)