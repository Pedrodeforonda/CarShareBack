import User from '../models/user.model.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { RegisterUserRequest, LoginUserRequest } from '../validations/user.validation.js';
import { UserResponseDto } from '../dtos/user.dto.js';

export class AuthService {
  async register(userData: RegisterUserRequest): Promise<UserResponseDto> {
    const existingUser = await User.findOne({ 
      $or: [
        { email: userData.email },
        { name: userData.name }
      ]
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new ConflictError('Email already exists');
      }
      throw new ConflictError('Username already exists');
    }

    const user = new User(userData);
    await user.save();

    return UserResponseDto.fromUser(user);
  }

  async login(userData: LoginUserRequest): Promise<UserResponseDto> {
    const user = await User.findOne({ email: userData.email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(userData.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return UserResponseDto.fromUser(user);
  }

  async findUserById(userId: string): Promise<UserResponseDto> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User');
    }

    return UserResponseDto.fromUser(user);
  }
}
