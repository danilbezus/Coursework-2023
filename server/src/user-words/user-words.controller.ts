import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-userWords.dto';
import { UserWordsService } from './user-words.service';

@Controller('user-words')
export class UserWordsController {
  constructor(private userWordsService: UserWordsService) {}

  @Post()
  async createWord(@Body() body: CreateWordDto) {
    const result = await this.userWordsService.create(body.userId, body.wordId);
    const { id } = result;
    return { id };
  }

  @Get()
  async getUserWords(@Query('userId') userId: number) {
    const result = await this.userWordsService.get(userId);
    return result;
  }

  @Delete()
  async deleteUserWord(
    @Query('userId') userId: number,
    @Query('wordId') wordId: number,
  ) {
    console.log(userId, wordId);
    const result = await this.userWordsService.delete(userId, wordId);
    return result;
  }

  async deleteWord(
    @Query('userId') userId: number,
    @Query('wordId') wordId: number,
  ) {
    const result = await this.userWordsService.delete(userId, wordId);
    return result;
  }
}
