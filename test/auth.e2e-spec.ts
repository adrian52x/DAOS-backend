import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { TestModule } from '../src/test.module';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/auth/auth.service';
import { Response } from 'express';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let userService: UsersService;
	let authService: AuthService;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [TestModule],
		}).compile();
		userService = moduleFixture.get<UsersService>(UsersService);
		authService = moduleFixture.get<AuthService>(AuthService);

		app = moduleFixture.createNestApplication();

		await app.init();
		await userService.deleteMany();
	});

	afterEach(async () => {
		await app.close();
	});

	describe('AuthController /auth/register', () => {
		it('should signup a valid user', async () => {
			// Arrange
			const validUser: CreateUserDto = { name: 'TestName', email: 'test@test.dk', password: 'password' };
			const expectedObject = { name: 'TestName', email: 'test@test.dk' };

			// Act
			const { body } = await request(app.getHttpServer()).post('/auth/register').send(validUser).expect(201); // assert

			// Assert
			expect(body._id).toBeDefined();
			expect(body.name).toBe(expectedObject.name);
			expect(body.email).toBe(expectedObject.email);
			expect(body.access_token).toBeDefined();
			expect(body.password).toBeUndefined(); // Ensure password is not returned in the response
		});

		it('should not signup a user with an invalid email', async () => {
			// Arrange
			const invalidUser: CreateUserDto = { name: 'TestName', email: 'invalid-email', password: 'password' };

			// Act
			const { body } = await request(app.getHttpServer()).post('/auth/register').send(invalidUser).expect(400); // assert

			// Assert
			expect(body.message).toContain('email must be an email');
			expect(body.error).toBe('Bad Request');
			expect(body.statusCode).toBe(400);
		});

		it('should encrypt the user password', async () => {
			// Arrange
			const validUser: CreateUserDto = { name: 'TestName', email: 'test@test.dk', password: 'password' };

			// Act
			await request(app.getHttpServer()).post('/auth/register').send(validUser).expect(201); // assert

			// Assert
			const createdUser = await userService.findOneByEmail(validUser.email);
			expect(createdUser).toBeDefined();
			expect(createdUser.password).not.toBe(validUser.password); // Ensure password is encrypted
		});
	});

	describe('AuthController /auth/login', () => {
		it('should return a token in cookies when logging in', async () => {
			// Arrange
			const res = {} as Response;
			res.cookie = jest.fn(); // Mock the cookie function
			await authService.register({ name: 'TestName', email: 'test@test.dk', password: 'password' }, res);

			// Act
			const response = await request(app.getHttpServer()).post('/auth/login').send({ email: 'test@test.dk', password: 'password' }).expect(201); // assert

			// Assert
			const cookies = response.headers['set-cookie'];
			expect(cookies).toBeDefined();
			const cookieArray = cookies[0].split('; ');
			expect(cookieArray.some((cookie: string) => cookie.includes('access_token'))).toBe(true);
		});
	});
});
