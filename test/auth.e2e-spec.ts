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
});
