import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(Post.name) private postModel: Model<PostDocument>,
		private readonly usersService: UsersService
	) {}

	async create(createPostDto: CreatePostDto): Promise<Post> {
		const user = await this.usersService.findOneById(createPostDto.user);
		if (!user) {
			throw new BadRequestException('User does not exist');
		}

		const createdPost = new this.postModel(createPostDto);
		return createdPost.save();
	}

	async findAll(): Promise<Post[]> {
		return this.postModel.find().exec();
	}
}
