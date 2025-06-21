import mongoose, { Schema, Model } from 'mongoose';
import { ISession } from '../types/models.js';
import locationSchema from './location.model.js';

type SessionModel = Model<ISession>;

const sessionSchema = new Schema<ISession, SessionModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car'
  },
  start_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  end_time: {
    type: Date
  },
  location: [locationSchema.schema],
  distance: {
    type: Number,
    default: 0,
    min: [0, 'Distance must be a positive number']
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create indexes for better performance
sessionSchema.index({ user: 1 });
sessionSchema.index({ car: 1 });
sessionSchema.index({ isActive: 1 });
sessionSchema.index({ start_time: -1 });

// Ensure only one active session per user
sessionSchema.index({ user: 1, isActive: 1 }, { 
  unique: true,
  partialFilterExpression: { isActive: true }
});

export default mongoose.model<ISession, SessionModel>('Session', sessionSchema);
