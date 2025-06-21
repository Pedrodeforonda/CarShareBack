import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { ResponseHelper } from '../utils/response.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      ResponseHelper.error(error.message, error.message)
    );
    return;
  }

  // MongoDB duplicate key error
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    res.status(409).json(
      ResponseHelper.error(`${field} already exists`, 'Duplicate key error')
    );
    return;
  }

  // MongoDB validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values((error as any).errors).map((err: any) => err.message);
    res.status(400).json(
      ResponseHelper.error('Validation failed', messages.join(', '))
    );
    return;
  }

  // MongoDB CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    res.status(400).json(
      ResponseHelper.error('Invalid ID format', 'Cast error')
    );
    return;
  }

  // Default error
  res.status(500).json(
    ResponseHelper.error('Internal server error', 'Something went wrong')
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(
    ResponseHelper.error(`Route ${req.originalUrl} not found`, 'Not found')
  );
};
