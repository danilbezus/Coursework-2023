import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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

  @Get()
  async getWords(@Query('id') id: number, @Res() res: Response) {
    const result = await this.wordsService.get(id);
    console.log(result);
    return res.send(result);
  }
}
