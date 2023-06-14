import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-userWords.dto';
import { UserWordsService } from './user-words.service';
import { Response } from 'express';

@Controller('user-words')
export class UserWordsController {
  constructor(private userWordsService: UserWordsService) {}

  @Post()
  async createWord(@Body() body: CreateWordDto, @Res() res: Response) {
    const result = await this.userWordsService.create(body.userId, body.wordId);
    const { id } = result;
    return res.send({ id });
  }
}
