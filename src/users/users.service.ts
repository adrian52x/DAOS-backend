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

			// Check if an instrument with the same name exists
			if (user.instruments.some((instrument) => instrument.name === newInstrument.name)) {
				throw new BadRequestException(ErrorMessages.INSTRUMENT_ALREADY_EXISTS + newInstrument.name);
			}
		}

		return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
	}

	async updateInstruments(userId: string, body: any): Promise<User> {
		// Fetch the user
		const user = await this.findOneById(userId);
		if (!user) {
			throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
		}

		if (body.action === 'update') {
			// Find the instrument using its attributes
			const instrument = user.instruments.find(
				(inst) => inst.name === body.instrumentData.name && inst.level === body.instrumentData.level && this.isSameGenreArray(inst.genre, body.instrumentData.genre) // Compare genre arrays
			);

			if (!instrument) {
				throw new NotFoundException('Instrument not found');
			}

			// Update the instrument
			Object.assign(instrument, body.instrumentData);
		} else if (body.action === 'delete') {
			// Filter out the instrument to delete
			const initialLength = user.instruments.length;
			user.instruments = user.instruments.filter(
				(inst) =>
					!(
						(inst.name === body.instrumentData.name && inst.level === body.instrumentData.level && this.isSameGenreArray(inst.genre, body.instrumentData.genre)) // Compare genre arrays
					)
			);

			if (user.instruments.length === initialLength) {
				throw new NotFoundException('Instrument not found for deletion');
			}
		} else {
			throw new BadRequestException('Invalid action. Use "update" or "delete".');
		}

		// Save the updated user
		await this.userModel.updateOne({ _id: userId }, { instruments: user.instruments });

		return user;
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

	// Helper method to compare two genre arrays
	private isSameGenreArray(genres1: string[], genres2: string[]): boolean {
		if (genres1.length !== genres2.length) return false;
		const sorted1 = [...genres1].sort();
		const sorted2 = [...genres2].sort();
		return sorted1.every((value, index) => value === sorted2[index]);
	}
}
