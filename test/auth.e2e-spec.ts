import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('AuthController E2E test', () => {
	let app: INestApplication; //the type annotattion for a nest app, enables the use of methods with app

	//creating a test environment
	beforeAll(async () => {
		//we create a testing module, fixture is labeling an environment that is used for testing
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	//for testing the authentication (e.g. login) we need to register the middleware here before everything

	//nestjs has the library supertest by default
	//uses supertest to make the request and we can use it to get the responses as well
	describe('Creating new users POST /auth/register', () => {
		const REGISTER_USER_URL = '/auth/register';

		//testing sucessfully creating a user
		it('shouldd create a new valid user', () => {
			return request(app.getHttpServer())
				.post(REGISTER_USER_URL)
				.send({
					name: 'testEva1',
					email: 'testEva@gmail.com',
					password: '1234',
				})
				.expect(201);
		});

		//testing wrong pass
		it('shouldd return a 400 when invalid password is provided', () => {
			return request(app.getHttpServer())
				.post(REGISTER_USER_URL)
				.send({
					name: 'testEva2',
					email: 'testEva@gmail.com',
					password: '12',
				})
				.expect(400);
		});

		//testing wrong email
		it('shouldd return a 400 when invalid email is provided', () => {
			return request(app.getHttpServer())
				.post(REGISTER_USER_URL)
				.send({
					name: 'testEva3',
					email: 'testEvaNotEmail',
					password: '1234',
				})
				.expect(400);
		});
	});
});
