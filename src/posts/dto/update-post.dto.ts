import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { InstrumentDto } from './instrument.dto';
import { Type } from 'class-transformer';

export class UpdatePostDto {
	@IsOptional()
	@IsString()
	readonly title: string;

	@IsOptional()
	@IsString()
	readonly description: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => InstrumentDto)
	readonly instrument: InstrumentDto;

	@IsOptional()
	@IsString()
	readonly ensemble: string; // Optional ensemble ID
}
