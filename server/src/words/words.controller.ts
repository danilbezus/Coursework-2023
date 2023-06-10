import { Body, Controller, Post } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-word.dto';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Post()
  createWord(@Body() body: CreateWordDto) {
    this.wordsService.create(
      body.word,
      body.definition,
      body.example,
      body.pronunciation,
    );
  }
}
