import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-word.dto';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Post()
  async createWord(@Body() body: CreateWordDto) {
    const result = await this.wordsService.create(body.word, body.wordOption);
    const { id } = result;
    return { id };
  }

  @Get()
  async getWords(@Query('id') id: number, @Query('word') word: string) {
    if (id) {
      const result = await this.wordsService.getById(id);
      return result;
    }

    if (word) {
      const result = await this.wordsService.getByName(word);
      return result;
    }
  }
}
