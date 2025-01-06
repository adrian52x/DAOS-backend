import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InstrumentDto } from '../../instruments/instrument.dto';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly email: string;

	@IsOptional()
	@IsString()
	readonly password: string;

	@IsOptional()
	@IsString()
	readonly address: string;

	@IsOptional()
	@IsString()
	readonly zipCode: string;

	@IsOptional()
	@IsString()
	readonly phone: string;

	@IsOptional()
	@IsString()
	readonly profileText: string;

	@IsOptional()
	@IsString()
	readonly dateOfBirth: Date;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => InstrumentDto)
	readonly instruments?: InstrumentDto[];
}
