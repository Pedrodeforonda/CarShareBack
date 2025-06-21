import { ApiResponse } from '../types/responses.js';

export class ResponseHelper {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error
    };
  }

  static created<T>(data: T, message: string = 'Resource created successfully'): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static noContent(message: string = 'No content'): ApiResponse {
    return {
      success: true,
      message
    };
  }
}
