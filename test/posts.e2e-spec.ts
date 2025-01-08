import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../src/test.module';

import { CreatePostDto } from '../src/posts/dto/create-post.dto';
import { UpdatePostDto } from '../src/posts/dto/update-post.dto';

import { PostsService } from '../src/posts/posts.service';
import { EnsemblesService } from '../src/ensembles/ensembles.service';
import { UsersService } from '../src/users/users.service';

describe('PostController E2E test', () => {
	let app: INestApplication;
	let token: string;
	let ensembleId: string;
	let postId: string;
	let userId: string;

	let postService: PostsService;
	let ensemblesService: EnsemblesService;
	let userService: UsersService;

	beforeEach(async () => {
		//we create a testing module, fixture is labeling an environment that is used for testing
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [TestModule],
		}).compile();
		postService = moduleFixture.get<PostsService>(PostsService);
		ensemblesService = moduleFixture.get<EnsemblesService>(EnsemblesService);
		userService = moduleFixture.get<UsersService>(UsersService);

		app = moduleFixture.createNestApplication();

		await app.init();
		await ensemblesService.deleteMany();
		await userService.deleteMany();
		await postService.deleteMany();

		//register a test user
		const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({ name: 'TestUserPost', email: 'testuserpost@gmail.com', password: '12345' });
		token = registerResponse.body.access_token;
		userId = registerResponse.body._id;
		// console.log('Register Response:', registerResponse.body);

		// register an ensemble
		const ensembleResponse = await request(app.getHttpServer())
			.post('/api/ensembles')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'TestEsemble1', address: 'Nordvest', zipCode: '2400', activeMembers: '6-10', owner: undefined, members: [] });
		ensembleId = ensembleResponse.body._id;
		// console.log('Ensemble Response:', ensembleResponse.body);

		// publish a post to update
		const postResponse = await request(app.getHttpServer())
			.post('/api/posts')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'This is a test title 2',
				description: 'This is a test description 2',
				instrument: { name: 'Guitar', level: 1, genre: ['Jazz'] },
				ensemble: ensembleId,
			});
		postId = postResponse.body._id;
		// console.log('Post Response:', postResponse.body);
	});

	afterEach(async () => {
		await app.close();
	});

	describe('Creating a new post, POST /api/posts', () => {
		it('should create a new post', async () => {
			// Arrange: Prepare data
			const createPostDto: CreatePostDto = {
				title: 'This is a test title',
				description: 'This is a test description',
				instrument: {
					name: 'Piano',
					level: 1,
					genre: ['Classical'],
				},
				ensemble: ensembleId,
			};

			// Act: Make the request
			const response = await request(app.getHttpServer())
				.post('/api/posts')
				.set('Authorization', `Bearer ${token}`) // Add the token
				.send(createPostDto);

			// Assert: Verify response
			expect(201);
			expect(response.body).toMatchObject({
				title: 'This is a test title',
				description: 'This is a test description',
				instrument: {
					name: 'Piano',
					level: 1,
					genre: ['Classical'],
				},
				ensemble: ensembleId,
			});
			// console.log(response.body);
			expect(response.body).toHaveProperty('_id'); // Check if an ID exists
			expect(response.body).toHaveProperty('author'); // Ensure 'author' is present
			expect(response.body.pendingRequests).toBeInstanceOf(Array); // Ensure 'pendingRequests' is an array
			expect(response.body.ensemble).toBe(ensembleId); // Ensure 'ensemble' is correct
			expect(response.body.author).toBe(userId); // Ensure 'userId' is correct
		});

		it('should update an existing post', async () => {
			// Arrange: Prepare data
			const updatePostDto: UpdatePostDto = {
				title: 'This is an UPDATED test title',
				description: 'This is an UPDATED test description',
				instrument: {
					name: 'Piano',
					level: 3,
					genre: ['Classical'],
				},
				ensemble: ensembleId, // Assuming ensemble ID is not changing
			};

			// Act: Make the request
			const response = await request(app.getHttpServer())
				.put(`/api/posts/${postId}`)
				.set('Authorization', `Bearer ${token}`) // Add the token
				.send(updatePostDto);

			// Assert: Verify response
			expect(response.status).toBe(200); // Expect status 200 for a successful update

			// Check if the response body contains the updated values
			expect(response.body).toMatchObject({
				title: 'This is an UPDATED test title',
				description: 'This is an UPDATED test description',
				instrument: {
					name: 'Piano',
					level: 3,
					genre: ['Classical'],
				},
				ensemble: ensembleId, // Ensure ensemble ID stays the same
			});

			// Ensure the post's _id is still the same
			expect(response.body._id).toBe(postId);

			// Ensure the author is still the same
			expect(response.body.author).toBe(userId);

			expect(response.body.pendingRequests).toBeInstanceOf(Array);

			// check the timestamp for update (to verify it was modified)
			expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(new Date(response.body.createdAt).getTime());
		});
	});

	describe('Filtering posts, POST /api/posts/filter [there is only 1 post]', () => {
		it('should return only posts with type: Find ensembles and instrument: Guitar ', async () => {
			const filterData = {
				type: 'Find ensembles',
				instrument: 'Guitar',
			};
	
			// Act: Make the request
			const response = await request(app.getHttpServer())
				.post('/api/posts/filter')
				.send(filterData);

			// Assert: Verify response
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBe(1); 
			expect(response.body[0]).toHaveProperty('ensemble');
			expect(response.body[0]).toHaveProperty('instrument'); 
			expect(response.body[0].instrument.name).toBe('Guitar'); 
		});


		it('should return only posts with type: Find musicians and genre: Jazz ', async () => {
			const filterData = {
				type: 'Find musicians',
				genre: 'Jazz',
			};
	
			// Act: Make the request
			const response = await request(app.getHttpServer())
				.post('/api/posts/filter')
				.send(filterData);

			// Assert: Verify response
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBe(0); 
		});
	});
});
