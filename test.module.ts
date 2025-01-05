import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';
import { EnsemblesModule } from 'src/ensembles/ensembles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRoot(process.env.TEST_MONGO_URI),
		JwtModule.register({
			secret: process.env.JWT_key,
			signOptions: { expiresIn: '1h' },
		}),
		UsersModule,
		PostsModule,
		EnsemblesModule,
		AuthModule,
	],
})
export class TestModule {}
