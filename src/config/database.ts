import mongoose from 'mongoose';
import { config } from './environment.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connectionString = config.mongoConnectionString;
    console.log('🔗 Connecting to MongoDB...');
    console.log('🔍 Connection string:', connectionString);
    
    await mongoose.connect(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};
