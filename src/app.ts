import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { config } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import { MqttHandler } from './mqtt/mqtt-handler.js';

// Middlewares
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';

class App {
  public app: express.Application;
  private mqttHandler: MqttHandler;

  constructor() {
    this.app = express();
    this.mqttHandler = new MqttHandler();
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: config.isDevelopment ? 1000 : 100, // limit each IP to 100 requests per windowMs in production
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        error: 'Rate limit exceeded'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // CORS
    this.app.use(cors({
      origin: config.isDevelopment ? '*' : ['http://localhost:3000'], // Configure for production
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        data: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: config.NODE_ENV,
          mqttConnected: this.mqttHandler.isConnected()
        }
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/auth', authRoutes);
    this.app.use('/car', carRoutes);
    this.app.use('/user', userRoutes);
    this.app.use('/sessions', sessionRoutes);
    
    // Root endpoint
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'CarShare Backend API',
        data: {
          version: '2.0.0',
          environment: config.NODE_ENV,
          timestamp: new Date().toISOString()
        }
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Connect to MQTT broker
      this.mqttHandler.connect();

      // Start the server
      this.app.listen(config.PORT, () => {
        console.log(`🚀 Server running on port ${config.PORT}`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = (signal: string) => {
      console.log(`\n📴 Received ${signal}. Starting graceful shutdown...`);
      
      // Close MQTT connection
      this.mqttHandler.disconnect();
      
      // Additional cleanup can be added here
      
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
  }
}

// Start the application
const app = new App();
app.start();
