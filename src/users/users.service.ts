import { BadRequestException, Injectable } from '@nestjs/common';
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
		return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
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
