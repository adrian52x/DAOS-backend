import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';

describe('AuthController E2E test', () => {
	let app: INestApplication;
	let userModel: Model<User>; // Model for the User collection
	let authToken: string;

	// creating a test environment
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Get the user model to interact with the database directly
		userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
	});

	// Properly close the application and clean up data after tests
	afterAll(async () => {
		// Clean up test data (deleting all test users)
		await userModel.deleteMany({}); // You can modify this to target only test users if needed
		await app.close();
	});

	// Testing user creation
	describe('Creating new users POST /auth/register', () => {
		const REGISTER_USER_URL = '/auth/register';

		// Test creating a valid user
		it('should create a new valid user', () => {
			return request(app.getHttpServer())
				.post(REGISTER_USER_URL)
				.send({
					name: 'testKama1',
					email: 'testKamas@gmail.com',
					password: '1234',
				})
				.expect(201);
		});

		// Test wrong password
		it('should return a 400 when invalid password is provided', () => {
			return request(app.getHttpServer())
				.post(REGISTER_USER_URL)
				.send({
					name: 'testKama2',
					email: 'testKamas@gmail.com',
					password: '12',
				})
				.expect(400);
		});
	});

	// Testing login for an existing user
	describe('Login an existing user POST /auth/login', () => {
		const REGISTER_USER_URL = '/auth/register';
		const LOGIN_USER_URL = '/auth/login';

		// First create a valid user before running login test
		beforeAll(async () => {
			await request(app.getHttpServer())
				.post(REGISTER_USER_URL)
				.send({
					name: 'testSofia1',
					email: 'testSofia1@gmail.com',
					password: '1234',
				})
				.expect(201);
		});

		// Test login with correct credentials
		it('should login an existing user and return a toker', async () => {
			const response = await request(app.getHttpServer())
				.post(LOGIN_USER_URL)
				.send({
					email: 'testSofia1@gmail.com',
					password: '1234',
				})
				.expect(201);

			// Check that the response.body contains a token field. (Jest's toHaveProperty Matcher)
			expect(response.body).toHaveProperty('access_token');
			authToken = response.body.access_token; // Store the token for later use
		});
	});

	// Testing using the token to access a protected route
	describe('Access profile with token POST /auth/profile', () => {
		const PROFILE_ROUTE = '/auth/profile';

		it('should access profile with valid token', () => {
			// Ensure the token is available before running the test
			expect(authToken).toBeDefined();

			return request(app.getHttpServer()).get(PROFILE_ROUTE).set('Authorization', `Bearer ${authToken}`).expect(200);
		});
	});
});
