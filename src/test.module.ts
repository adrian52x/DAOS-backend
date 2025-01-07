import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EnsemblesModule } from './ensembles/ensembles.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { APP_PIPE } from '@nestjs/core';

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
	providers: [
		{
			provide: APP_PIPE,
			useClass: ValidationPipe, // Global validation pipe
		},
	],
})
export class TestModule {}
