import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEnsembleDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()  // Remove optional decorator later
	readonly address: string;

	@IsString()
	@IsOptional() // Remove optional decorator later
	readonly zipCode: string;

	@IsString()
	@IsOptional() // Remove optional decorator later
	readonly activeMembers: string;

	readonly owner: string;

	readonly members: string[];
}