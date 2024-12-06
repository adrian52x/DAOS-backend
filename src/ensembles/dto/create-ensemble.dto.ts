import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnsembleDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsString()
	@IsNotEmpty()
	readonly address: string;

	@IsString()
	@IsNotEmpty()
	readonly zipCode: string;

	@IsString()
	@IsNotEmpty()
	readonly activeMembers: string;

	readonly owner: string;

	readonly members: string[];
}
