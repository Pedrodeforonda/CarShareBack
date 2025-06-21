import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ResponseHelper } from '../utils/response.js';
import { RegisterUserRequest, LoginUserRequest } from '../validations/user.validation.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request<{}, {}, RegisterUserRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(
        ResponseHelper.created(user, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request<{}, {}, LoginUserRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.login(req.body);
      res.status(200).json(
        ResponseHelper.success(user, 'User logged in successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.findUserById(req.params.id);
      res.status(200).json(
        ResponseHelper.success(user, 'User profile retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}
