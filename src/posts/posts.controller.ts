import { Controller, Get, Post, Body, Put, Param, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('/api/posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	@UseGuards(AuthGuard)
	create(@Body() createPostDto: CreatePostDto, @Request() req) {
		const userId = req.user._id; // authenticated user's id
		return this.postsService.create(createPostDto, userId);
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
		const userId = req.user._id; // authenticated user's id
		return this.postsService.update(id, updatePostDto, userId);
	}

	@Get('/author/:authorId')
	findAllByAuthorId(@Param('authorId') authorId: string) {
		return this.postsService.findAllByAuthorId(authorId);
	}

	// Add this endpoint to fetch a post by ID
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postsService.findOneById(id);
	}

	@Get()
	async getPosts(
		@Query('limit') limit: string, // limit number of posts (pagination)
		@Query('page') page: string, // page number (pagination)
		@Query('area') area: string, // filter by area
		@Query('instrument') instrument: string, // filter by instrument
		@Query('experience') experience: string, // filter by experience level
		@Query('sort') sort: string // sorting (e.g., 'date', 'experience')
	) {
		const postLimit = parseInt(limit, 10) || 0; // default to 5 posts per request
		const postPage = parseInt(page, 10) || 1; // default to page 1
		const filters = { area, instrument, experience }; // filters for post search
		const sortOption = sort || 'createdAt'; // default sort by creation date
		// Fetch filtered and paginated posts from the service
		return this.postsService.getFilteredPosts(postLimit, postPage, filters, sortOption);
	}
}
