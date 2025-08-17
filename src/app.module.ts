import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';
import { CommonModule } from '@common/common.module';
import { FilesModule } from '@files/files.module';
import { ProductsModule } from '@products/products.module';
import { SeedModule } from '@seed/seed.module';
import envConfiguration from '@config/app.config';
import { envConfigurationSchema } from '@config/app-config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      validationSchema: envConfigurationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigType<typeof envConfiguration>) => {
        const logger = new Logger('Postgres');

        const {
          postgresHost,
          postgresPort,
          postgresdb,
          postgresUser,
          postgresPassword,
        } = config;

        logger.log(
          `Database connected into ${postgresdb} on port ${postgresPort}`,
        );

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
      },
      inject: [envConfiguration.KEY],
    }),
    AuthModule,
    CommonModule,
    FilesModule,
    ProductsModule,
    SeedModule,
  ],
})
export class AppModule {}
