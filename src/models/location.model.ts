import mongoose, { Schema, Model } from 'mongoose';
import { ILocation } from '../types/models.js';

type LocationModel = Model<ILocation>;

const locationSchema = new Schema<ILocation, LocationModel>({
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  }
}, {
  _id: false,
  versionKey: false
});

export default mongoose.model<ILocation, LocationModel>('Location', locationSchema);
