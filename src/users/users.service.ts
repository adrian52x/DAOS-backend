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

			// Check if an instrument with the same name and level exists
			if (user.instruments.some((instrument) => instrument.name === newInstrument.name && instrument.level === newInstrument.level)) {
				throw new BadRequestException(ErrorMessages.INSTRUMENT_ALREADY_EXISTS + newInstrument.name);
			}

			// Add alert logic here
			console.log('Instrument Added:', newInstrument); // Backend alert
		}

		return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
	}

	async deleteInstrument(userId: string, instrumentData: { name: string; level: number }): Promise<User> {
		// Validate user existence
		const user = await this.findOneById(userId);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		// Filter out the instrument by name and level
		const initialLength = user.instruments.length;
		user.instruments = user.instruments.filter((inst) => !(inst.name === instrumentData.name && inst.level === instrumentData.level));

		if (user.instruments.length === initialLength) {
			throw new NotFoundException('Instrument not found for deletion');
		}

		// Update the database
		await this.userModel.updateOne({ _id: userId }, { instruments: user.instruments });

		// Log successful deletion
		console.log('Instrument Deleted:', instrumentData);

		// Return updated user
		const updatedUser = await this.findOneById(userId);
		return updatedUser;
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
