import Session from '../models/session.model.js';
import { NotFoundError } from '../utils/errors.js';
import { SessionResponseDto, FuelConsumptionResponseDto, TotalCostResponseDto } from '../dtos/session.dto.js';

export class UserService {
  private readonly FUEL_EFFICIENCY = 11.5; // km per liter
  private readonly FUEL_COST_PER_LITER = 1013; // CLP per liter

  async getFuelConsumption(sessionId: string): Promise<FuelConsumptionResponseDto> {
    const session = await Session.findById(sessionId);

    if (!session) {
      throw new NotFoundError('Session');
    }

    const distance = session.distance;
    const fuelConsumption = (distance / this.FUEL_EFFICIENCY) * this.FUEL_COST_PER_LITER;

    return new FuelConsumptionResponseDto(sessionId, distance, fuelConsumption);
  }

  async getAllSessions(): Promise<SessionResponseDto[]> {
    const sessions = await Session.find({})
      .populate('user', 'name email')
      .populate('car', 'model brand year')
      .sort({ start_time: -1 });

    return SessionResponseDto.fromSessions(sessions);
  }

  async getSessionsByUser(userId: string): Promise<SessionResponseDto[]> {
    const sessions = await Session.find({ user: userId })
      .populate('user', 'name email')
      .populate('car', 'model brand year')
      .sort({ start_time: -1 });

    return SessionResponseDto.fromSessions(sessions);
  }

  async getActiveSession(userId?: string): Promise<SessionResponseDto | null> {
    const query = userId ? { user: userId, isActive: true } : { isActive: true };
    
    const session = await Session.findOne(query)
      .populate('user', 'name email')
      .populate('car', 'model brand year');

    return session ? SessionResponseDto.fromSession(session) : null;
  }

  async getTotalCost(userId: string): Promise<TotalCostResponseDto> {
    const sessions = await Session.find({ user: userId });

    let totalCost = 0;
    let totalDistance = 0;

    for (const session of sessions) {
      const sessionCost = (session.distance / this.FUEL_EFFICIENCY) * this.FUEL_COST_PER_LITER;
      totalCost += sessionCost;
      totalDistance += session.distance;
    }

    return new TotalCostResponseDto(userId, sessions.length, totalDistance, totalCost);
  }

  async getSessionById(sessionId: string): Promise<SessionResponseDto> {
    const session = await Session.findById(sessionId)
      .populate('user', 'name email')
      .populate('car', 'model brand year');

    if (!session) {
      throw new NotFoundError('Session');
    }

    return SessionResponseDto.fromSession(session);
  }
}
