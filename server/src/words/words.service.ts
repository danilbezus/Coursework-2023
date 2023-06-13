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

    const wordOptions = await parsingService.getPage(word.toLowerCase());
    const firstOption = Object.values(wordOptions)[0];

    const { translation, definition, example, pronunciation, partsOfSpeech } =
      firstOption;
    const existingWord = await this.repo.findOne({
      where: [{ word }, { translation }],
    });
    if (!existingWord) {
      const newWord = this.repo.create({
        word,
        translation,
        definition,
        example,
        pronunciation,
        partsOfSpeech,
      });
      return this.repo.save(newWord);
    }
  }
}
