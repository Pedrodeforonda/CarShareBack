import Car from '../models/car.model.js';
import User from '../models/user.model.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';
import { RegisterCarRequest } from '../validations/car.validation.js';
import { CarResponseDto } from '../dtos/car.dto.js';
import { UserResponseDto } from '../dtos/user.dto.js';

export class CarService {
  async registerCar(carData: RegisterCarRequest): Promise<CarResponseDto> {
    // Verify admin exists
    const admin = await User.findById(carData.admin);
    if (!admin) {
      throw new NotFoundError('Admin user');
    }

    // Verify all users exist if provided
    if (carData.users && carData.users.length > 0) {
      const users = await User.find({ _id: { $in: carData.users } });
      if (users.length !== carData.users.length) {
        throw new NotFoundError('One or more users');
      }
    }

    const car = new Car(carData);
    await car.save();

    return CarResponseDto.fromCar(car);
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await User.find({}).sort({ name: 1 });
    return UserResponseDto.fromUsers(users);
  }

  async findCarById(carId: string): Promise<CarResponseDto> {
    const car = await Car.findById(carId)
      .populate('admin', 'name email')
      .populate('users', 'name email');
    
    if (!car) {
      throw new NotFoundError('Car');
    }

    return CarResponseDto.fromCar(car);
  }

  async findCarsByAdmin(adminId: string): Promise<CarResponseDto[]> {
    const cars = await Car.find({ admin: adminId })
      .populate('admin', 'name email')
      .populate('users', 'name email')
      .sort({ createdAt: -1 });

    return CarResponseDto.fromCars(cars);
  }

  async findCarsByUser(userId: string): Promise<CarResponseDto[]> {
    const cars = await Car.find({ 
      $or: [
        { admin: userId },
        { users: userId }
      ]
    })
      .populate('admin', 'name email')
      .populate('users', 'name email')
      .sort({ createdAt: -1 });

    return CarResponseDto.fromCars(cars);
  }

  async deleteCar(carId: string, adminId?: string): Promise<void> {
    const car = await Car.findById(carId);
    
    if (!car) {
      throw new NotFoundError('Car');
    }

    // If adminId is provided, verify that the user is the admin of the car
    if (adminId && car.admin.toString() !== adminId) {
      throw new UnauthorizedError('Only the car admin can delete this car');
    }

    await Car.findByIdAndDelete(carId);
  }
}
