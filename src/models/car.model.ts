import mongoose, { Schema, Model } from 'mongoose';
import { ICar } from '../types/models.js';

type CarModel = Model<ICar>;

const carSchema = new Schema<ICar, CarModel>({
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
    maxlength: [50, 'Model must be less than 50 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [50, 'Brand must be less than 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be 1900 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  consumedFuel: {
    type: Number,
    required: [true, 'Consumed fuel is required'],
    min: [0, 'Consumed fuel must be a positive number'],
    default: 0
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin is required']
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Create indexes for better performance
carSchema.index({ admin: 1 });
carSchema.index({ users: 1 });
carSchema.index({ brand: 1, model: 1 });

export default mongoose.model<ICar, CarModel>('Car', carSchema);
