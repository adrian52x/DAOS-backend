import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEnsembleDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	readonly owner?: string;

	readonly members?: string[];
}