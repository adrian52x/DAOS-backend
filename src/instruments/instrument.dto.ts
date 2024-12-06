import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class InstrumentDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly level: number;

  @IsNotEmpty()
  @IsString()
  readonly genre: string;
}