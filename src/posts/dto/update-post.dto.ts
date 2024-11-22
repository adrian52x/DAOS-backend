import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Instrument } from '../schema/post.schema';

export class UpdatePostDto {

    @IsOptional()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
	@IsArray()
	readonly instruments: Instrument[];

	@IsOptional()
	@IsString()
	readonly ensemble: string; // Optional ensemble ID
}