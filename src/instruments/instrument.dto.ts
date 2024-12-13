import { IsNotEmpty, IsString, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class InstrumentDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsNumber()
	readonly level: number;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	readonly genre: string[];
}
