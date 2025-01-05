import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateEnsembleDto } from 'src/ensembles/dto/create-ensemble.dto';
import mongoose from 'mongoose';
import { AppModule } from 'src/app.module';

process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/daos-e2e-test';

describe('EnsemblesController E2E test', () => {
	let app: INestApplication;
	let token: string;

	//creating a test environment
	beforeAll(async () => {
		console.log('Environment Variables at Start:', {
			TEST_MONGO_URI: process.env.TEST_MONGO_URI,
			JWT_KEY: process.env.JWT_KEY,
		});
		//we create a testing module, fixture is labeling an environment that is used for testing
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		console.log('Connecting to MongoooDB...');
		await mongoose.connect(process.env.TEST_MONGO_URI);
		// Clear existing database collections
		const collections = await mongoose.connection.db.collections();
		for (const collection of collections) {
			await collection.deleteMany({});
		}
		console.log('MongoDB Connection Ready Stateee:', mongoose.connection.readyState);

		//register
		const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({ name: 'TestUser6', email: 'testuser6@gmail.com', password: '12345' });
		console.log('Register Response Body:', registerResponse.body);

		//log in the user
		const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({ email: 'testuser6@gmail.com', password: '12345' });
		token = loginResponse.body.access_token;
		console.log('Login Response:', loginResponse.body);
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Creating new ensembles, POST /api/ensembles', () => {
		it('should create a new ensemble', async () => {
			// Arrange: Prepare data
			const createEnsembleDto: CreateEnsembleDto = {
				name: 'Testing Ensemble2',
				address: 'Lyngby',
				zipCode: '2880',
				activeMembers: '6-10',
				owner: undefined,
				members: [],
			};

			console.log('Token:', token);

			// Act: Make the request
			const response = await request(app.getHttpServer())
				.post('/api/ensembles')
				.set('Authorization', `Bearer ${token}`) // Add JWT token
				.send(createEnsembleDto);

			// Assert: Verify response
			expect(201);
			expect(response.body).toMatchObject({
				name: 'Testing Ensemble2',
				address: 'Lyngby',
				zipCode: '2880',
				activeMembers: '6-10',
			});
			expect(response.body).toHaveProperty('_id'); // Check if an ID exists
			expect(response.body).toHaveProperty('owner'); // Ensure 'owner' is present
			expect(response.body.members).toBeInstanceOf(Array); // Ensure 'members' is an array
			expect(response.body.members).toContain(response.body.owner); // Ensure owner is in 'members'
		});
	});
});
