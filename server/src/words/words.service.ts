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
      where: { word, translation, definition },
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
  async getById(id: number) {
    const [word] = await this.repo.find({ where: { id } });
    return word;
  }

  async getByName(word: string) {
    const allWords = await this.repo.find({ where: { word } });
    return allWords;
  }

  async deleteById(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      return 'Слово не знайдено';
    }
    return 'Слово видалено';
  }

  async deleteByName(word: string) {
    const result = await this.repo.delete({ word });
    if (result.affected === 0) {
      return 'Елемент не знайдено';
    }
    return 'Слово видалено';
  }
}
