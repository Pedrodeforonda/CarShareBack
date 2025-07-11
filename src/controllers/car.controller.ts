import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/car.service.js';
import { ResponseHelper } from '../utils/response.js';
import { RegisterCarRequest, CarIdRequest, AdminIdRequest, UserIdParamRequest, DeleteCarRequest } from '../validations/car.validation.js';

export class CarController {
  private carService: CarService;

  constructor() {
    this.carService = new CarService();
  }

  registerCar = async (req: Request<{}, {}, RegisterCarRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const car = await this.carService.registerCar(req.body);
      res.status(201).json(
        ResponseHelper.created(car, 'Car registered successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.carService.findAllUsers();
      res.status(200).json(
        ResponseHelper.success(users, 'Users retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getCarById = async (req: Request<CarIdRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const car = await this.carService.findCarById(req.params.id);
      res.status(200).json(
        ResponseHelper.success(car, 'Car retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getCarsByAdmin = async (req: Request<AdminIdRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cars = await this.carService.findCarsByAdmin(req.params.adminId);
      res.status(200).json(
        ResponseHelper.success(cars, 'Cars retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  getCarsByUser = async (req: Request<UserIdParamRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cars = await this.carService.findCarsByUser(req.params.userId);
      res.status(200).json(
        ResponseHelper.success(cars, 'Cars retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  deleteCar = async (req: Request<CarIdRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.carService.deleteCar(req.params.id);
      res.status(200).json(
        ResponseHelper.success(null, 'Car deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  deleteCarWithAdmin = async (req: Request<DeleteCarRequest['params'], {}, DeleteCarRequest['body']>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.carService.deleteCar(req.params.id, req.body.adminId);
      res.status(200).json(
        ResponseHelper.success(null, 'Car deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}
