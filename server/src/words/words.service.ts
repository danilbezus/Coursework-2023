import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';

@Injectable()
export class WordsService {
  constructor(@InjectRepository(Word) private repo: Repository<Word>) {}

  create(
    word: string,
    definition: string,
    example: string,
    pronunciation: string,
  ) {
    const newWord = this.repo.create({
      word,
      definition,
      example,
      pronunciation,
    });

    return this.repo.save(newWord);
  }
}
