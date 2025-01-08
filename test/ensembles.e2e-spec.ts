import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateEnsembleDto } from 'src/ensembles/dto/create-ensemble.dto';
import { TestModule } from '../src/test.module';
import { EnsemblesService } from '../src/ensembles/ensembles.service';
import { UsersService } from '../src/users/users.service';

describe('EnsemblesController E2E test', () => {
	let app: INestApplication;
	let ensembleService: EnsemblesService;
	let userService: UsersService;

	let token: string;
	let userId: string;

	beforeEach(async () => {
		//we create a testing module, fixture is labeling an environment that is used for testing
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [TestModule],
		}).compile();
		ensembleService = moduleFixture.get<EnsemblesService>(EnsemblesService);
		userService = moduleFixture.get<UsersService>(UsersService);

		app = moduleFixture.createNestApplication();

		await app.init();
		await ensembleService.deleteMany();
		await userService.deleteMany();

		
		//register - we need only this, cause we are logging in the user automatically after registering
		const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({ name: 'TestUser', email: 'testuser@gmail.com', password: '12345' });
		token = registerResponse.body.access_token;
		userId = registerResponse.body._id;
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
				owner: userId,
				members: [userId],
			});
			expect(response.body).toHaveProperty('_id'); // Check if an ID exists
			expect(response.body).toHaveProperty('owner'); // Ensure 'owner' is present
			expect(response.body.members).toBeInstanceOf(Array); // Ensure 'members' is an array
			expect(response.body.members).toContain(response.body.owner); // Ensure owner is in 'members'
		});
	});
});
