import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(Post.name) private postModel: Model<PostDocument>,
		private readonly usersService: UsersService
	) {}

	async create(createPostDto: CreatePostDto, userId: Types.ObjectId): Promise<Post> {
		const user = await this.usersService.findOneById(userId);
		if (!user) {
			throw new BadRequestException('User does not exist');
		}

		const createdPost = new this.postModel({...createPostDto, user: user._id});
		return createdPost.save();
	}

	async findAll(): Promise<Post[]> {
		return this.postModel.find().exec();
	}

	async findOneById(id: Types.ObjectId): Promise<Post> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid post ID');
		}
		return this.postModel.findById(id).exec();
	}

	async update(id: Types.ObjectId, updatePostDto: UpdatePostDto, userId: Types.ObjectId): Promise<Post> {
		const post = await this.findOneById(id);
		if (!post) {
			console.log('Post not found');
			
		  throw new BadRequestException('Post not found');
		}
		if (post.user.toString() !== userId.toString()) {
			console.log("User who created the post", post.user);
			console.log("User who is trying to update", userId);
			
		  throw new UnauthorizedException('You do not have permission to update this post');
		}
		return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
	}
}
 