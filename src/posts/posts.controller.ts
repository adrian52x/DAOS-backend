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
		console.log('Updating Ensemble ID:', id);
		console.log('Authenticated User ID:', userId);
		return this.postsService.update(id, updatePostDto, userId);
	}

	@Get('/author/:authorId')
	findAllByAuthorId(@Param('authorId') authorId: string) {
		return this.postsService.findAllByAuthorId(authorId);
	}

	// Add this endpoint to fetch a post by ID
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postsService.findOneByIdPopulated(id);
	}

	@Get('/ensemble/:ensembleId')
	async findAllByEnsemble(@Param('ensembleId') ensembleId: string) {
		return this.postsService.findAllByEnsembleId(ensembleId);
	}

	@Post('filter')
	async getPosts(
		@Query('limit') limit: string, // limit number of posts (pagination)
		@Query('page') page: string, // page number (pagination)
		@Query('sort') sort: string, // sorting (e.g., 'date', 'experience')
		@Body() body: {
			type?: string;
			title?: string;
			instrument?: string;
			genre?: string;
		  }
	) {
		const { type, title, instrument, genre } = body;

		const postLimit = parseInt(limit, 10) || 0; // default - all posts 
		const postPage = parseInt(page, 10) || 1; // default to page 1
		const sortOption = sort || 'createdAt'; // default sort by creation date

		const filters: any = { type, title, instrument, genre};


		return this.postsService.getFilteredPosts(postLimit, postPage, filters, sortOption);
	}
}
