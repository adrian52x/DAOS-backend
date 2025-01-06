import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { EnsemblesModule } from './ensembles/ensembles.module';
import { AppController } from './app.controller'; // Import the AppController
import configuration from './configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		DatabaseModule,
		UsersModule,
		PostsModule,
		EnsemblesModule,
		AuthModule,
	],
	controllers: [AppController], // Add AppController here
})
export class AppModule {}
