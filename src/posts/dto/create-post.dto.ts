import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Instrument } from '../schema/post.schema';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly description: string;

	@IsNotEmpty()
	@IsString()
	readonly instruments: Instrument[];

	@IsOptional()
	@IsString()
	readonly ensemble?: string; // Optional ensemble ID
}
