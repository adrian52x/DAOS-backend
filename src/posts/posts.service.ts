import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { EnsemblesService } from 'src/ensembles/ensembles.service';
import { ErrorMessages } from 'src/constants/error-messages';

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(Post.name) private postModel: Model<PostDocument>,
		private readonly usersService: UsersService,
		private readonly ensemblesService: EnsemblesService
	) {}

	async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
		const user = await this.usersService.findOneById(userId);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		// In case the post is part of an ensemble, check if the ensemble exists
		if (createPostDto.ensemble) {
			const ensemble = await this.ensemblesService.findOneById(createPostDto.ensemble);
			if (!ensemble) {
				throw new BadRequestException(ErrorMessages.ENSEMBLE_NOT_FOUND);
			}

			// Check if the authenticated user is the owner of the ensemble
			if (ensemble.owner._id.toString() !== userId.toString()) {
				throw new UnauthorizedException(ErrorMessages.NO_PERMISSION_CREATE_POST);
			}
		}

		const createdPost = new this.postModel({ ...createPostDto, author: user._id });
		return createdPost.save();
	}

	async findOneById(id: string): Promise<Post> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException(ErrorMessages.INVALID_POST_ID);
		}
		return this.postModel.findById(id).populate('ensemble author').exec();
	}

	async findAllByEnsembleId(ensembleId: string): Promise<Post[]> {
		// Validate the ensembleId
		if (!Types.ObjectId.isValid(ensembleId)) {
			throw new BadRequestException('Invalid Ensemble ID');
		}

		// Find posts that have the provided ensembleId
		return this.postModel
			.find({ ensemble: ensembleId }) // Filter by ensemble ID
			.populate('ensemble author') // Populate ensemble and author details
			.exec();
	}

	async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
		const post = await this.findOneById(id);
		if (!post) {
			throw new BadRequestException(ErrorMessages.POST_NOT_FOUND);
		}
		if (post.author.toString() !== userId.toString()) {
			console.log('User who created the post', post.author);
			console.log('User who is trying to update', userId);

			throw new UnauthorizedException(ErrorMessages.NO_PERMISSION_UPDATE_POST);
		}
		return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
	}

	async findAll(): Promise<Post[]> {
		return this.postModel.find().exec();
	}

	async findAllByAuthorId(authorId: string): Promise<Post[]> {
		const user = await this.usersService.findOneById(authorId);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		return this.postModel.find({ author: authorId }).populate('ensemble').exec();
	}

	/**
	 * Fetch posts with pagination, filtering, and sorting options.
	 * @param limit - number of posts to return per page
	 * @param page - page number for pagination
	 * @param filters - object containing the filters (e.g., area, instrument, etc.)
	 * @param sortOption - field to sort by (e.g., createdAt, experience)
	 */
	async getFilteredPosts(limit: number, page: number, filters: any, sortOption: string): Promise<Post[]> {
		// Build query based on filters
		const filterQuery: any = {};
		// Add filters dynamically to the query
		if (filters.area) {
			filterQuery.area = { $regex: filters.area, $options: 'i' }; // case-insensitive search
		}
		if (filters.instrument) {
			filterQuery.instrument = { $in: filters.instrument.split(',') }; // split instruments if multiple values are provided
		}
		if (filters.experience) {
			filterQuery.experience = { $gte: parseInt(filters.experience, 10) };
		}

		// Pagination logic
		const skip = (page - 1) * limit;
		// Sorting option (default to sorting by createdAt if not specified)
		const sort = sortOption || 'createdAt';
		// Query the database with filters, pagination, and sorting
		return this.postModel
			.find(filterQuery) // Apply filters
			.sort({ [sort]: -1 }) // Sort based on the sort option (descending order)
			.skip(skip) // Skip posts for pagination
			.limit(limit) // Limit the number of posts returned
			.populate('ensemble author');
	}
	/**
	 * Fetch the latest posts with optional limit.
	 */
	async getLatestPosts(limit: number) {
		return this.postModel
			.find() // No filters by default
			.sort({ createdAt: -1 }) // Sort by creation date (descending)
			.limit(limit); // Limit the number of posts returned
	}
}
