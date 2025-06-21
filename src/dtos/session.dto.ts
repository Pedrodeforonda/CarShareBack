import { Types } from 'mongoose';
import { ISession, ILocation } from '../types/models.js';

export class SessionResponseDto {
  id: string;
  user: string;
  car?: string;
  startTime: Date;
  endTime?: Date;
  location: ILocation[];
  distance: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(session: ISession & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }) {
    this.id = session._id.toString();
    this.user = session.user.toString();
    this.car = session.car?.toString();
    this.startTime = session.start_time;
    this.endTime = session.end_time;
    this.location = session.location;
    this.distance = session.distance;
    this.isActive = session.isActive;
    this.createdAt = session.createdAt;
    this.updatedAt = session.updatedAt;
  }

  static fromSession(session: ISession & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }): SessionResponseDto {
    return new SessionResponseDto(session);
  }

  static fromSessions(sessions: (ISession & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date })[]): SessionResponseDto[] {
    return sessions.map(session => new SessionResponseDto(session));
  }
}

export class FuelConsumptionResponseDto {
  sessionId: string;
  distance: number;
  fuelConsumption: number;
  unit: string;

  constructor(sessionId: string, distance: number, fuelConsumption: number) {
    this.sessionId = sessionId;
    this.distance = distance;
    this.fuelConsumption = fuelConsumption;
    this.unit = 'CLP'; // Chilean Peso
  }
}

export class TotalCostResponseDto {
  userId: string;
  totalSessions: number;
  totalDistance: number;
  totalCost: number;
  currency: string;

  constructor(userId: string, totalSessions: number, totalDistance: number, totalCost: number) {
    this.userId = userId;
    this.totalSessions = totalSessions;
    this.totalDistance = totalDistance;
    this.totalCost = totalCost;
    this.currency = 'CLP'; // Chilean Peso
  }
}
