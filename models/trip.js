import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    distance: {
        type: Number,
        required: true,
    },
});