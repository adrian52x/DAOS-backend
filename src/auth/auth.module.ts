import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
	// imports: [
	// 	UsersModule,
	// 	JwtModule.register({
	// 		secret: 'secretKey',
	// 		signOptions: { expiresIn: '60s' },
	// 	}),
	// ],
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('jwtKey'),
				signOptions: { expiresIn: '300s' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

// imports: [
//     UsersModule,
//     JwtModule.registerAsync({
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('jwtKey'),
//         signOptions: { expiresIn: '60s' },
//       }),
//     }),
//   ],
