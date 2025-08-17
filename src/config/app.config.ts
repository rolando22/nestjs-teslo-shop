import { Environment } from '@common/enums/enviroment.enum';
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  // APP
  // GENERAL
  environment: (process.env.NODE_ENV || 'dev') as Environment,
  port: parseInt(process.env.PORT || '3000', 10),
  hostApi: process.env.HOST_API || 'http://localhost:3001/api',
  // DATABASE - POSTGRES
  postgresdb: process.env.POSTGRES_DB || '',
  postgresHost: process.env.POSTGRES_HOST || '',
  postgresUser: process.env.POSTGRES_USER || '',
  postgresPassword: process.env.POSTGRES_PASSWORD || '',
  postgresPort: parseInt(process.env.POSTGRES_PORT || '5432'),
  // JWT
  jwtSecret: process.env.JWT_SECRET || '',
}));
