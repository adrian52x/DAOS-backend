import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configuration';


@Module({
    imports: [
      ConfigModule.forRoot({
        load: [configuration],
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('database.mongo.uri'),
        }),
        inject: [ConfigService],
      }),
    ],
  })
  export class MongoConfigModule {}