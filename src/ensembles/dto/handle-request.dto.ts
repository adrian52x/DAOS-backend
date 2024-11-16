import { IsNotEmpty, IsEnum } from 'class-validator';

export enum JoinRequestAction {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

export class HandleRequestDto {

  @IsNotEmpty()
  @IsEnum(JoinRequestAction)
  readonly action: JoinRequestAction;

}