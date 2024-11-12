import { BadRequestException, Body, Controller, Post, Get, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// @UsePipes(new ValidationPipe())
	@Post('login')
	async login(@Body() loginBody: LoginDto): Promise<any | BadRequestException> {
		return this.authService.login(loginBody);
	}

	@Post('register')
	async register(@Body() registerBody: CreateUserDto): Promise<CreateUserDto | BadRequestException> {
		return await this.authService.register(registerBody);
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		console.log('profile', req.user);
		
		return req.user;
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Get('admin')
	getSomethingAdminOnly() {
		return "This is an admin only route";
	}
}
