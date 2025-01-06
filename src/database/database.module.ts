import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const isTestEnvironment = process.env.NODE_ENV === 'test';
				const uri = isTestEnvironment ? configService.get<string>('TEST_MONGO_URI') : configService.get<string>('MONGO_URI');

				return {
					uri,
					onConnectionCreate: (connection: Connection) => {
						connection.on('connected', () => console.log(`Connected to ${isTestEnvironment ? 'test' : 'main'} database: ${connection.host}`));
						return connection;
					},
				};
			},
		}),
	],
})
export class DatabaseModule {}
