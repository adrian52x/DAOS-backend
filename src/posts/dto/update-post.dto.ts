import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    // @IsNotEmpty()
    // readonly user: Types.ObjectId;
}