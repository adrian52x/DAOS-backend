import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Instrument } from '../schema/user.schema';

export class UpdateUserDto {

	readonly name: string;

	readonly email: string;

	readonly password: string;

    readonly address: string;
    
    readonly zipcode: string;

    readonly phone: string;

    readonly profileText: string;

    readonly dateOfBirth: Date;

    readonly instruments: Instrument[];


}
