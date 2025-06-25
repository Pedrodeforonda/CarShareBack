import { Types } from 'mongoose';
import { ICar } from '../types/models.js';

export class CarResponseDto {
  id: string;
  model: string;
  brand: string;
  year: number;
  fuelEfficiency: number;
  fuelType: 'Nafta Super' | 'Nafta Premium' | 'Diesel';
  admin: string;
  users: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(car: ICar & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }) {
    this.id = car._id.toString();
    this.model = car.model;
    this.brand = car.brand;
    this.year = car.year;
    this.fuelEfficiency = car.fuelEfficiency;
    this.fuelType = car.fuelType;
    this.admin = car.admin.toString();
    this.users = car.users.map(user => user.toString());
    this.createdAt = car.createdAt;
    this.updatedAt = car.updatedAt;
  }

  static fromCar(car: ICar & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }): CarResponseDto {
    return new CarResponseDto(car);
  }

  static fromCars(cars: (ICar & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date })[]): CarResponseDto[] {
    return cars.map(car => new CarResponseDto(car));
  }
}
