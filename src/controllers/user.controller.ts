import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { ResponseHelper } from '../utils/response.js';
import { FuelConsumptionRequest, TotalCostRequest, SessionIdRequest } from '../validations/session.validation.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getFuelConsumption = async (req: Request<{}, {}, FuelConsumptionRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const consumption = await this.userService.getFuelConsumption(req.body.sessionId);
      res.status(200).json(
        ResponseHelper.success(consumption, 'Fuel consumption calculated successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getAllSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessions = await this.userService.getAllSessions();
      res.status(200).json(
        ResponseHelper.success(sessions, 'Sessions retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getSessionsByUser = async (req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessions = await this.userService.getSessionsByUser(req.params.userId);
      res.status(200).json(
        ResponseHelper.success(sessions, 'User sessions retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getActiveSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const session = await this.userService.getActiveSession(userId);
      
      if (session) {
        res.status(200).json(
          ResponseHelper.success(session, 'Active session retrieved successfully')
        );
      } else {
        res.status(200).json(
          ResponseHelper.success(null, 'No active session found')
        );
      }
    } catch (error) {
      next(error);
    }
  };

  getTotalCost = async (req: Request<{}, {}, TotalCostRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const totalCost = await this.userService.getTotalCost(req.body.user);
      res.status(200).json(
        ResponseHelper.success(totalCost, 'Total cost calculated successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getSessionById = async (req: Request<SessionIdRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await this.userService.getSessionById(req.params.id);
      res.status(200).json(
        ResponseHelper.success(session, 'Session retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}
