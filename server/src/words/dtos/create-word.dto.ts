import { IsString } from 'class-validator';

export class CreateWordDto {
  @IsString()
  word: string;

  @IsString()
  definition: string;

  @IsString()
  example: string;

  @IsString()
  pronunciation: string;
}
