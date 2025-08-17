import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import envConfiguration from '@config/app.config';
import { databaseConnection } from './connection';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConnection,
      inject: [envConfiguration.KEY],
    }),
  ],
})
export class DatabaseModule {}
