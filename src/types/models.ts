import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface ICar {
  _id?: Types.ObjectId;
  model: string;
  brand: string;
  year: number;
  consumedFuel: number;
  admin: Types.ObjectId;
  users: Types.ObjectId[];
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface ISession {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  car?: Types.ObjectId;
  start_time: Date;
  end_time?: Date;
  location: ILocation[];
  distance: number;
  isActive: boolean;
}

export interface MqttLiveData {
  loc: {
    lat: number;
    lng: number;
  };
  distance: number;
}
