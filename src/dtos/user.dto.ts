import { Types } from 'mongoose';
import { IUser } from '../types/models.js';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: IUser & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromUser(user: IUser & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }): UserResponseDto {
    return new UserResponseDto(user);
  }

  static fromUsers(users: (IUser & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date })[]): UserResponseDto[] {
    return users.map(user => new UserResponseDto(user));
  }
}
