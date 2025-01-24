//lib/env.ts
import dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde el archivo .env
const result = dotenv.config({
  path: resolve(__dirname, '../../.env')
});

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Validar variables de entorno requeridas
const requiredEnvVars = [
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_CALLBACK_URL',
  'JWT_SECRET',
  'SESSION_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_DIALECT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}