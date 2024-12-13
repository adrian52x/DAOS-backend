import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorMessages } from 'src/constants/error-messages';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const createdUser = new this.userModel(createUserDto);
		return createdUser.save();
	}

	async update(updateUserDto: UpdateUserDto, userId: string): Promise<User> {
		const user = await this.findOneById(userId);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		if (updateUserDto.instruments) {
			const newInstrument = updateUserDto.instruments[updateUserDto.instruments.length - 1];

			if (user.instruments.some((instrument) => instrument.name === newInstrument.name)) {
				throw new BadRequestException(ErrorMessages.INSTRUMENT_ALREADY_EXISTS + newInstrument.name);
			}
		}

		return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
	}

	async deleteInstrument(userId: string, instrumentName: string): Promise<User> {
		const user = await this.findOneById(userId);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		const doesInstrumentExists = !!user.instruments.find((inst) => inst.name === instrumentName);
		if (!doesInstrumentExists) throw new NotFoundException(ErrorMessages.INSTRUMENT_DOES_NOT_EXIST);

		user.instruments = user.instruments.filter((inst) => inst.name !== instrumentName);

		await this.userModel.updateOne({ _id: userId }, { instruments: user.instruments });

		return this.findOneById(userId);
	}

	async findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.userModel.findOne({ email }).exec();
	}

	async findOneById(id: string): Promise<User> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException(ErrorMessages.INVALID_USER_ID);
		}
		return this.userModel.findById(id).exec();
	}
}
