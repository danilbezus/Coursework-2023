import { Body, Controller, Post, Res } from '@nestjs/common';
import ParsingService from './parsing.service';
import { Response } from 'express';

@Controller('parsing')
export class ParsingController {
  constructor(private parsingService: ParsingService) {}

  @Post()
  async parse(@Body() body: { word: string }, @Res() res: Response) {
    const { word } = body;
    const result = await this.parsingService.getPage(word.toLowerCase());
    return res.send(result);
  }
}
