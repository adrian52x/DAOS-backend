import { Controller, Get, Post, Body, Put, Param, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { Types } from 'mongoose';

@Controller('/api/posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	@UseGuards(AuthGuard)
	create(@Body() createPostDto: CreatePostDto, @Request() req) {
		const userId = req.user._id; //  authenticated user's id
		return this.postsService.create(createPostDto, userId);
	}

	@Get()
	findAll() {
		return this.postsService.findAll();
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	async update(@Param('id') id: Types.ObjectId, @Body() updatePostDto: UpdatePostDto, @Request() req) {
		const userId = req.user._id; // authenticated user's id
		return this.postsService.update(id, updatePostDto, userId);
	}
}
 