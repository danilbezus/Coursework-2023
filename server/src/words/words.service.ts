import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { WordOption } from './dtos/create-word.dto';

@Injectable()
export class WordsService {
  constructor(@InjectRepository(Word) private repo: Repository<Word>) {}

  async create(word: string, wordOption: WordOption) {
    const { translation, definition, example, pronunciation, partsOfSpeech } =
      wordOption;
    const existingWord = await this.repo.findOne({
      where: { word, translation },
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
    } else {
      return existingWord;
    }
  }
  async get(id: number) {
    const [word] = await this.repo.find({ where: { id } });
    return word;
  }
}
