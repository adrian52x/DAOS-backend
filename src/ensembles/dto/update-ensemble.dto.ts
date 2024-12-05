import { IsOptional, IsString } from 'class-validator';

export class UpdateEnsembleDto {
	@IsOptional()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly address: string;

	@IsOptional()
	@IsString()
	readonly zipCode: string;

	@IsOptional()
	@IsString()
	readonly activeMembers: string;
}
