import { IsNumber } from 'class-validator';

export class CreateWordDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  wordId: number;
}
