import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  dogApiBaseUrl: string;
  logLevel: string;
  corsOrigin: string[];
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dogApiBaseUrl: process.env.DOG_API_BASE_URL || 'https://dog.ceo/api',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
};

export default config;