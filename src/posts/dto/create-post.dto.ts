import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { Instrument } from '../schema/post.schema';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly description: string;

	@IsNotEmpty()
	@IsArray()
	readonly instruments: Instrument[];

	@IsOptional()
	@IsString()
	readonly ensemble?: string; // Optional ensemble ID
}
