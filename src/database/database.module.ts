import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../configuration';
import { Connection } from 'mongoose';
//https://docs.nestjs.com/techniques/configuration

@Module({
	imports: [
		// ConfigModule.forRoot({   // --> loaded the custom configuration file inside app.module.ts
		// 	load: [configuration],
		// }),
		MongooseModule.forRootAsync({
			//imports: [ConfigModule], // --> is set to global, so it is not necessary to import it here
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
