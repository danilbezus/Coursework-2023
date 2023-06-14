import { Body, Controller, Post } from '@nestjs/common';
import ParsingService from './parsing.service';

@Controller('parsing')
export class ParsingController {
  constructor(private parsingService: ParsingService) {}

  @Post()
  async parse(@Body() body: { word: string }) {
    const { word } = body;
    const result = await this.parsingService.getPage(word.toLowerCase());
    return result;
  }
}
