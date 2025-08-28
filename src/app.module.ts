import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { CommonModule } from '@common/common.module';
import { FilesModule } from '@files/files.module';
import { ProductsModule } from '@products/products.module';
import { SeedModule } from '@seed/seed.module';
import { MessagesWsModule } from '@messages-ws/messages-ws.module';
import envConfiguration from '@config/app.config';
import { envConfigurationSchema } from '@config/app-config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      validationSchema: envConfigurationSchema,
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CommonModule,
    FilesModule,
    ProductsModule,
    SeedModule,
    MessagesWsModule,
  ],
})
export class AppModule {}
