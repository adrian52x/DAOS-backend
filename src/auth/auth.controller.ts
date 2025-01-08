import { BadRequestException, Body, Controller, Post, Get, Request, UseGuards, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() loginBody: LoginDto, @Res({ passthrough: true }) res: Response): Promise<any | BadRequestException> {
		return this.authService.login(loginBody, res);
	}

	@Post('register')
	async register(@Body() registerBody: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<CreateUserDto | BadRequestException> {
		return await this.authService.register(registerBody, res);
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		console.log('logout');

		return this.authService.logout(res);
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		const userId = req.user._id;
		return this.authService.getProfile(userId);
	}
}
