import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EnsemblesModule } from './ensembles/ensembles.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { Connection } from 'mongoose';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.test'),
            }),
        }),
        UsersModule,
        PostsModule,
        EnsemblesModule,
        AuthModule,
    ],
  })
  export class TestModule {}