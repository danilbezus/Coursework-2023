import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { WordOption } from './dtos/create-word.dto';
import { UserWordsService } from 'src/user-words/user-words.service';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word) private repo: Repository<Word>,
    private readonly userWordsService: UserWordsService,
  ) {}

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
      return false;
    }
    await this.userWordsService.delete(id);
    return true;
  }

  async deleteByName(word: string) {
    const allWords = await this.getByName(word);
    const result = await this.repo.delete({ word });
    if (result.affected === 0) {
      return false;
    }
    for (const elem of allWords) {
      await this.userWordsService.delete(elem.id);
    }
    return true;
  }
}
