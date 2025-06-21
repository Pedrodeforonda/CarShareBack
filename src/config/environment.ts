import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  MONGO_URL: z.string().min(1, 'MongoDB URL is required'),
  MONGO_USER: z.string().optional(),
  MONGO_PASS: z.string().optional(),
  MQTT_HOST: z.string().min(1, 'MQTT host is required'),
  MQTT_PORT: z.string().transform(Number).default('1883'),
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
});

const configResult = configSchema.safeParse(process.env);

if (!configResult.success) {
  console.error('❌ Invalid environment variables:', configResult.error.format());
  process.exit(1);
}

export const config = {
  ...configResult.data,
  isDevelopment: configResult.data.NODE_ENV === 'development',
  isProduction: configResult.data.NODE_ENV === 'production',
  isTest: configResult.data.NODE_ENV === 'test',
  mongoConnectionString: configResult.data.MONGO_USER && configResult.data.MONGO_PASS 
    ? `mongodb://${configResult.data.MONGO_USER}:${configResult.data.MONGO_PASS}@${configResult.data.MONGO_URL}:27017/carshare`
    : `mongodb://${configResult.data.MONGO_URL}:27017/carshare`,
  mqttConnectionString: `mqtt://${configResult.data.MQTT_HOST}:${configResult.data.MQTT_PORT}`,
} as const;
