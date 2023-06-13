import { Body, Controller, Post } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-userWords.dto';
import { UserWordsService } from './user-words.service';

@Controller('user-words')
export class UserWordsController {
  constructor(private userWordsService: UserWordsService) {}

  @Post()
  createWord(@Body() body: CreateWordDto) {
    this.userWordsService.create(body.userId, body.wordId);
  }
}
