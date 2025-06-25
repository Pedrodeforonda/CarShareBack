import Session from '../models/session.model.js';
import Car from '../models/car.model.js';
import { NotFoundError } from '../utils/errors.js';
import { SessionResponseDto, FuelConsumptionResponseDto, TotalCostResponseDto } from '../dtos/session.dto.js';

export class UserService {
  private readonly DEFAULT_FUEL_EFFICIENCY = 11.5; // km per liter (fallback if no car)
  
  // Precios de combustible en Argentina (ARS por litro) - actualizados a 2025
  private readonly FUEL_COSTS = {
    'Nafta Super': 1200,   // ARS per liter
    'Nafta Premium': 1400, // ARS per liter
    'Diesel': 1250         // ARS per liter
  };
  
  private readonly DEFAULT_FUEL_COST = this.FUEL_COSTS['Nafta Super']; // Default for cars without fuel type

  async getFuelConsumption(sessionId: string): Promise<FuelConsumptionResponseDto> {
    const session = await Session.findById(sessionId).populate('car');

    if (!session) {
      throw new NotFoundError('Session');
    }

    const distance = session.distance;
    let fuelEfficiency = this.DEFAULT_FUEL_EFFICIENCY;
    let fuelCostPerLiter = this.DEFAULT_FUEL_COST;

    // Use car's fuel efficiency and fuel type if available
    if (session.car) {
      const car = session.car as any;
      if (car.fuelEfficiency) {
        fuelEfficiency = car.fuelEfficiency;
      }
      if (car.fuelType && this.FUEL_COSTS[car.fuelType as keyof typeof this.FUEL_COSTS]) {
        fuelCostPerLiter = this.FUEL_COSTS[car.fuelType as keyof typeof this.FUEL_COSTS];
      }
    }

    const fuelConsumption = (distance / fuelEfficiency) * fuelCostPerLiter;

    return new FuelConsumptionResponseDto(sessionId, distance, fuelConsumption);
  }

  async getAllSessions(): Promise<SessionResponseDto[]> {
    const sessions = await Session.find({})
      .populate('user', 'name email')
      .populate('car', 'model brand year fuelEfficiency')
      .sort({ start_time: -1 });

    return SessionResponseDto.fromSessions(sessions);
  }

  async getSessionsByUser(userId: string): Promise<SessionResponseDto[]> {
    const sessions = await Session.find({ user: userId })
      .populate('user', 'name email')
      .populate('car', 'model brand year fuelEfficiency')
      .sort({ start_time: -1 });

    return SessionResponseDto.fromSessions(sessions);
  }

  async getSessionsByCar(carId: string): Promise<SessionResponseDto[]> {
    const sessions = await Session.find({ car: carId })
      .populate('user', 'name email')
      .populate('car', 'model brand year fuelEfficiency')
      .sort({ start_time: -1 });

    return SessionResponseDto.fromSessions(sessions);
  }

  async getActiveSession(userId?: string): Promise<SessionResponseDto | null> {
    const query = userId ? { user: userId, isActive: true } : { isActive: true };
    
    const session = await Session.findOne(query)
      .populate('user', 'name email')
      .populate('car', 'model brand year fuelEfficiency');

    return session ? SessionResponseDto.fromSession(session) : null;
  }

  async getTotalCost(userId: string): Promise<TotalCostResponseDto> {
    const sessions = await Session.find({ user: userId }).populate('car');

    let totalCost = 0;
    let totalDistance = 0;

    for (const session of sessions) {
      let fuelEfficiency = this.DEFAULT_FUEL_EFFICIENCY;
      let fuelCostPerLiter = this.DEFAULT_FUEL_COST;
      
      // Use car's fuel efficiency and fuel type if available
      if (session.car) {
        const car = session.car as any;
        if (car.fuelEfficiency) {
          fuelEfficiency = car.fuelEfficiency;
        }
        if (car.fuelType && this.FUEL_COSTS[car.fuelType as keyof typeof this.FUEL_COSTS]) {
          fuelCostPerLiter = this.FUEL_COSTS[car.fuelType as keyof typeof this.FUEL_COSTS];
        }
      }

      const sessionCost = (session.distance / fuelEfficiency) * fuelCostPerLiter;
      totalCost += sessionCost;
      totalDistance += session.distance;
    }

    return new TotalCostResponseDto(userId, sessions.length, totalDistance, totalCost);
  }

  async getSessionById(sessionId: string): Promise<SessionResponseDto> {
    const session = await Session.findById(sessionId)
      .populate('user', 'name email')
      .populate('car', 'model brand year fuelEfficiency');

    if (!session) {
      throw new NotFoundError('Session');
    }

    return SessionResponseDto.fromSession(session);
  }
}
