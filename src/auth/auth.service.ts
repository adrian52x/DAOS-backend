import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { ErrorMessages } from 'src/constants/error-messages';

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

	async login(user: LoginDto): Promise<any> {
		const validatedUser = await this.validateUser(user.email, user.password);
		
		const payload = { _id: validatedUser._id, email: validatedUser.email, name: validatedUser.name };
		return { access_token: this.jwtService.sign(payload) };
	}

	async register(user: CreateUserDto): Promise<any> {
		try {
			const existingUser = await this.usersService.findOneByEmail(user.email);
			if (existingUser) {
				throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
			}
			const hashedPassword = await bcrypt.hash(user.password, 10);
			const newUser: CreateUserDto = { ...user, password: hashedPassword };
			await this.usersService.create(newUser);
			return this.login({ email: user.email, password: user.password });
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new InternalServerErrorException(ErrorMessages.UNKNOW_REGISTER_ERROR);
		}
	}
}
