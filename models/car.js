import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    fuelEfficiency: {
        type: Number,
        required: true,
        min: 1,
        max: 50,
        default: 11.5
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

export default mongoose.model('Car', carSchema);