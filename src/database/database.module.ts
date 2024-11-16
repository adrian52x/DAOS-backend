import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
//https://docs.nestjs.com/techniques/configuration

@Module({
	imports: [
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('database.uri'), // --> get a custom configuration value
				//uri: configService.get<string>('MONGO_URI'),  // --> get an environment variable

				onConnectionCreate: (connection: Connection) => {
					connection.on('connected', () => console.log(`Connected to ${connection.name} database. URI: ${connection.host}`));
					return connection;
				},
			}),
		}),
	],
})
export class DatabaseModule {}
