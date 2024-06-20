import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    speed: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
});

export default mongoose.model('Data', dataSchema);