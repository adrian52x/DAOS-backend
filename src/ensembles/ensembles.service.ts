import { Injectable, BadRequestException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ensemble, EnsembleDocument } from './schema/ensemble.schema';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UsersService } from '../users/users.service';
import { HandleRequestDto, JoinRequestAction } from './dto/handle-request.dto';
import { ErrorMessages } from '../constants/error-messages';
import { UpdateEnsembleDto } from './dto/update-ensemble.dto';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/schema/post.schema';

@Injectable()
export class EnsemblesService {
	constructor(
		@InjectModel(Ensemble.name) private ensembleModel: Model<EnsembleDocument>,
		@InjectModel(Post.name) private postModel: Model<Post>,
		private readonly usersService: UsersService,

		@Inject(forwardRef(() => PostsService))
		private readonly postsService: PostsService
	) {}

	async create(createEnsembleDto: CreateEnsembleDto): Promise<Ensemble> {
		const user = await this.usersService.findOneById(createEnsembleDto.owner);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		const existingEnsemble = await this.findByName(createEnsembleDto.name);
		if (existingEnsemble) {
			throw new BadRequestException(ErrorMessages.ENSEMBLE_EXISTS);
		}

		const createdEnsemble = new this.ensembleModel(createEnsembleDto);
		return createdEnsemble.save();
	}

	async update(ensembleId: string, updateEnsembleDto: UpdateEnsembleDto, userId: string): Promise<Ensemble> {
		const ensemble = await this.findOneById(ensembleId);

		if (!ensemble) {
			throw new BadRequestException('Ensemble not found');
		}
		if (ensemble.owner.toString() !== userId.toString()) {
			throw new UnauthorizedException('No permission to update this ensemble');
		}
		return this.ensembleModel.findByIdAndUpdate(ensembleId, updateEnsembleDto, { new: true }).exec();
	}

	async findOneByIdPopulated(id: string): Promise<Ensemble> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException(ErrorMessages.INVALID_ENSEMBLE_ID);
		}
		return this.ensembleModel
			.findById(id)
			.populate('owner')
			.populate({
				path: 'members',
				model: 'User',
				select: '_id name',
			})
			.exec();
	}

	async findOneById(id: string): Promise<Ensemble> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException(ErrorMessages.INVALID_ENSEMBLE_ID);
		}
		return this.ensembleModel.findById(id).exec();
	}

	async findByName(name: string): Promise<Ensemble> {
		return this.ensembleModel.findOne({ name }).exec();
	}

	async findAll(): Promise<Ensemble[]> {
		return this.ensembleModel.find().exec();
	}

	async requestToJoin(ensembleId: string, postId: string, userId: string): Promise<Post> {
		const ensemble = await this.findOneById(ensembleId);
		const post = await this.postsService.findOneById(postId);

		if (!post) {
			throw new BadRequestException(ErrorMessages.POST_NOT_FOUND);
		}

		if (!ensemble) {
			throw new BadRequestException(ErrorMessages.ENSEMBLE_NOT_FOUND);
		}

		if (ensemble.members.includes(userId) || post.pendingRequests.includes(userId)) {
			throw new BadRequestException(ErrorMessages.ALREADY_MEMBER_OR_PENDING);
		}

		post.pendingRequests.push(userId);

		return this.postModel.findByIdAndUpdate(postId, post, { new: true }).exec();
	}

	async handleJoinRequest(ensembleId: string, postId: string, handleUserId: string, actionDto: HandleRequestDto, userId: string): Promise<[Post, Ensemble]> {
		const ensemble = await this.findOneById(ensembleId);
		const post = await this.postsService.findOneById(postId);

		if (!post) {
			throw new BadRequestException(ErrorMessages.POST_NOT_FOUND);
		}

		if (!ensemble) {
			throw new BadRequestException(ErrorMessages.ENSEMBLE_NOT_FOUND);
		}

		if (ensemble.owner.toString() !== userId.toString()) {
			throw new BadRequestException(ErrorMessages.ONLY_OWNER_CAN_HANDLE_REQUESTS);
		}

		if (!post.pendingRequests.includes(handleUserId)) {
			throw new BadRequestException(ErrorMessages.NO_PENDING_REQUEST);
		}

		if (actionDto.action === JoinRequestAction.ACCEPT) {
			post.pendingRequests = post.pendingRequests.filter((id) => id !== handleUserId);
			ensemble.members.push(handleUserId);
		} else if (actionDto.action === JoinRequestAction.REJECT) {
			post.pendingRequests = post.pendingRequests.filter((id) => id !== handleUserId);
		}

		const [updatedPost, updatedEnsemble] = await Promise.all([
			this.postModel.findByIdAndUpdate(postId, post, { new: true }).exec(),
			this.ensembleModel.findByIdAndUpdate(ensembleId, ensemble, { new: true }).exec(),
		]);

		return [updatedPost, updatedEnsemble];
	}

	async findAllUserOwn(userId: string): Promise<Ensemble[]> {
		return this.ensembleModel.find({ owner: userId }).exec();
	}

	async findEnsemblesByUser(userId: string): Promise<Ensemble[]> {
		return this.ensembleModel.find({ members: userId }).exec();
	}

	async deleteMany() {
		return this.ensembleModel.deleteMany({}).exec();
	}
}
