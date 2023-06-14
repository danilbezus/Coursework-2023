import { IsObject, IsString } from 'class-validator';

export interface WordOption {
  translation: string;
  definition: string;
  example: string;
  pronunciation: string;
  partsOfSpeech: string;
}

export class CreateWordDto {
  @IsString()
  word: string;

  @IsObject()
  wordOption: WordOption;
}
