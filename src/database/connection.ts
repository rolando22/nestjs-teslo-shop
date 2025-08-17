import { Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import envConfiguration from '@config/app.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConnection = (
  config: ConfigType<typeof envConfiguration>,
): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions => {
  const logger = new Logger('Postgres');

  const {
    postgresHost,
    postgresPort,
    postgresdb,
    postgresUser,
    postgresPassword,
  } = config;

  logger.log(`Database connected into ${postgresdb} on port ${postgresPort}`);

  return {
    type: 'postgres',
    host: postgresHost,
    port: postgresPort,
    database: postgresdb,
    username: postgresUser,
    password: postgresPassword,
    autoLoadEntities: true,
    synchronize: true,
  };
};
