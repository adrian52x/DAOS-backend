import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { ErrorMessages } from '../constants/error-messages';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user: User = await this.usersService.findOneByEmail(email);
		if (!user) {
			throw new BadRequestException(ErrorMessages.INVALID_CREDS);
		}
		const isMatch: boolean = bcrypt.compareSync(password, user.password);
		if (!isMatch) {
			throw new BadRequestException(ErrorMessages.INVALID_CREDS);
		}
		return user;
	}

	async login(user: LoginDto, res: Response): Promise<any> {
		const validatedUser = await this.validateUser(user.email, user.password);
		const payload = { _id: validatedUser._id, email: validatedUser.email, name: validatedUser.name };
		const accessToken = this.jwtService.sign(payload);

		// access_token in cookies
		res.cookie('access_token', accessToken);

	    // Return the user without the password
		const userWithoutPassword = { ...JSON.parse(JSON.stringify(validatedUser)), password: undefined, access_token: accessToken };
    	return userWithoutPassword;
	}

	async register(user: CreateUserDto, res: any): Promise<any> {
		try {
			const existingUser = await this.usersService.findOneByEmail(user.email);
			if (existingUser) {
				throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
			}
			const hashedPassword = await bcrypt.hash(user.password, 10);
			
			const newUser: CreateUserDto = { ...user, password: hashedPassword };
			await this.usersService.create(newUser);
			return this.login({ email: user.email, password: user.password }, res);
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new InternalServerErrorException(ErrorMessages.UNKNOW_REGISTER_ERROR);
		}
	}

	async logout(res: Response): Promise<any> {
		// Clear the access_token cookie
		console.log('logout service');
		
		res.clearCookie('access_token');
		return { message: 'Logout successful' };
	}

	async getProfile(userId: string): Promise<any> {
		const user = await this.usersService.findOneById(userId);
		if (!user) {
		  throw new UnauthorizedException(ErrorMessages.USER_NOT_FOUND);
		}
	
		// Convert the Mongoose document to a plain object and remove the password field
		const userWithoutPassword = { ...JSON.parse(JSON.stringify(user)), password: undefined };
    	return userWithoutPassword;
	}
}
