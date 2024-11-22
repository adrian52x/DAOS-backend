import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
// import { Types } from 'mongoose';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string; // Ensemble name

	@IsNotEmpty()
	@IsString()
	readonly area: string; // Location

	@IsNotEmpty()
	@IsString() // Keep as string if ranges are allowed
	readonly numOfMusicians: string;

	@IsNotEmpty()
	@IsString()
	readonly description: string; // Post title

	@IsNotEmpty()
	@IsArray() // Multiple instruments
	@IsString({ each: true })
	readonly instrument: string[];

	@IsNotEmpty()
	@IsNumber()
	readonly experience: number; // Years of experience

	@IsOptional()
	@IsString()
	readonly ensemble?: string; // Optional ensemble ID
}
