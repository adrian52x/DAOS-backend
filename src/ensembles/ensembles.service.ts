import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ensemble, EnsembleDocument } from './schema/ensemble.schema';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UsersService } from '../users/users.service';
import { HandleRequestDto, JoinRequestAction } from './dto/handle-request.dto';
import { ErrorMessages } from 'src/constants/error-messages';

@Injectable()
export class EnsemblesService {
	constructor(
		@InjectModel(Ensemble.name) private ensembleModel: Model<EnsembleDocument>,
		private readonly usersService: UsersService
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

	async findOneById(id: string): Promise<Ensemble> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException(ErrorMessages.INVALID_ENSEMBLE_ID);
		}
		return this.ensembleModel.findById(id).populate('owner').exec();
	}

	async findByName(name: string): Promise<Ensemble> {
		return this.ensembleModel.findOne({ name }).exec();
	}

	async findAll(): Promise<Ensemble[]> {
		return this.ensembleModel.find().exec();
	}

	async requestToJoin(ensembleId: string, userId: string): Promise<Ensemble> {
		const ensemble = await this.findOneById(ensembleId);
		if (!ensemble) {
			throw new BadRequestException(ErrorMessages.ENSEMBLE_NOT_FOUND);
		}

		if (ensemble.members.includes(userId) || ensemble.pendingRequests.includes(userId)) {
			throw new BadRequestException(ErrorMessages.ALREADY_MEMBER_OR_PENDING);
		}
		ensemble.pendingRequests.push(userId);

		return this.ensembleModel.findByIdAndUpdate(ensembleId, ensemble, { new: true }).exec();
	}

	async handleJoinRequest(ensembleId: string, handleUserId: string, actionDto: HandleRequestDto, userId: string): Promise<Ensemble> {
		const ensemble = await this.findOneById(ensembleId);
		if (!ensemble) {
			throw new BadRequestException(ErrorMessages.ENSEMBLE_NOT_FOUND);
		}

		if (ensemble.owner._id.toString() !== userId.toString()) {
			throw new BadRequestException(ErrorMessages.ONLY_OWNER_CAN_HANDLE_REQUESTS);
		}

		if (!ensemble.pendingRequests.includes(handleUserId)) {
			throw new BadRequestException(ErrorMessages.NO_PENDING_REQUEST);
		}

		if (actionDto.action === JoinRequestAction.ACCEPT) {
			ensemble.pendingRequests = ensemble.pendingRequests.filter((id) => id !== handleUserId);
			ensemble.members.push(handleUserId);
		} else if (actionDto.action === JoinRequestAction.REJECT) {
			ensemble.pendingRequests = ensemble.pendingRequests.filter((id) => id !== handleUserId);
		}

		return this.ensembleModel.findByIdAndUpdate(ensembleId, ensemble, { new: true }).exec();
	}

	async findAllUserOwn(userId: string): Promise<Ensemble[]> {
		return this.ensembleModel.find({ owner: userId }).exec();
	}

	async findAllUserMember(userId: string): Promise<Ensemble[]> {
		return this.ensembleModel.find({ members: userId }).exec();
	}
}
