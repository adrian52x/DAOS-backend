import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() loginBody: LoginDto): Promise<any | BadRequestException> {
		console.log(loginBody);

		return this.authService.login(loginBody);
	}
	@Post('register')
	async register(@Body() registerBody: CreateUserDto): Promise<CreateUserDto | BadRequestException> {
		return await this.authService.register(registerBody);
	}
}
