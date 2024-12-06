import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';
import { InstrumentDto } from '../../instruments/instrument.dto';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly description: string;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => InstrumentDto)
	readonly instrument: InstrumentDto;

	@IsOptional()
	@IsString()
	readonly ensemble: string; // Optional ensemble ID
}
