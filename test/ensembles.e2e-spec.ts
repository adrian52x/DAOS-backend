import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateEnsembleDto } from 'src/ensembles/dto/create-ensemble.dto';
import mongoose from 'mongoose';
import { TestModule } from '../src/test.module';

describe('EnsemblesController E2E test', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		//we create a testing module, fixture is labeling an environment that is used for testing
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [TestModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		await mongoose.connect(process.env.TEST_MONGO_URI);
		// Clear existing database collections
		const collections = await mongoose.connection.db.collections();
		for (const collection of collections) {
			await collection.deleteMany({});
		}

		//register - we need only this, cause we are logging in the user automatically after registering
		const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({ name: 'TestUser8', email: 'testuser8@gmail.com', password: '12345' });
		token = registerResponse.body.access_token;
		// // console.log('Login Response:', registerResponse.body);
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Creating new ensembles, POST /api/ensembles', () => {
		it('should create a new ensemble', async () => {
			// Arrange: Prepare data
			const createEnsembleDto: CreateEnsembleDto = {
				name: 'Testing Ensemble3',
				address: 'Lyngby',
				zipCode: '2880',
				activeMembers: '6-10',
				owner: undefined,
				members: [],
			};

			// Act: Make the request
			const response = await request(app.getHttpServer())
				.post('/api/ensembles')
				.set('Authorization', `Bearer ${token}`) // Add the token
				.send(createEnsembleDto);

			// Assert: Verify response
			expect(201);
			expect(response.body).toMatchObject({
				name: 'Testing Ensemble3',
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
