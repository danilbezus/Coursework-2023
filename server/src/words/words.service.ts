import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import ParsingService from './parsing.service';

@Injectable()
export class WordsService {
  constructor(@InjectRepository(Word) private repo: Repository<Word>) {}

  async create(word: string) {
    const parsingService = new ParsingService();
    const { definition, example, pronunciation } = await parsingService.getPage(
      word.toLowerCase(),
    );
    const newWord = this.repo.create({
      word,
      definition,
      example,
      pronunciation,
    });
    return this.repo.save(newWord);
  }
}
