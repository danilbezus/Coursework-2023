import { Body, Controller, Post } from '@nestjs/common';
import { CreateWordDto } from './dtos/create-word.dto';

@Controller('auth')
export class WordsController {
  @Post()
  createWord(@Body() body: CreateWordDto) {
    console.log(body);
  }
}
