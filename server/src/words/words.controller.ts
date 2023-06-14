import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-word.dto';
import { WordsService } from './words.service';
import { Response } from 'express';

@Controller('words')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Post()
  async createWord(@Body() body: CreateWordDto, @Res() res: Response) {
    const result = await this.wordsService.create(body.word, body.wordOption);
    const { id } = result;
    return res.send({ id });
  }
}
