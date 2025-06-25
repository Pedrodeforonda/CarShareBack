import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { ResponseHelper } from '../utils/response.js';
import { FuelConsumptionRequest, TotalCostRequest, SessionIdRequest, StartSessionRequest } from '../validations/session.validation.js';
import { MqttHandler } from '../mqtt/mqtt-handler.js';

export class UserController {
  private userService: UserService;
  private mqttHandler: MqttHandler;

  constructor() {
    this.userService = new UserService();
    this.mqttHandler = new MqttHandler();
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

  startSession = async (req: Request<{}, {}, StartSessionRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, carId } = req.body;
      
      // Usar MQTT para iniciar la sesión (simular mensaje del ESP32)
      await this.mqttHandler.simulateSessionStart(userId);
      
      // Esperar un momento para que se procese
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Obtener la sesión creada
      const session = await this.userService.getActiveSession(userId);
      
      res.status(201).json(
        ResponseHelper.created(session, 'Session started successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  stopSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Usar MQTT para parar la sesión
      await this.mqttHandler.simulateSessionStop();
      
      res.status(200).json(
        ResponseHelper.success(null, 'Session stopped successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}
