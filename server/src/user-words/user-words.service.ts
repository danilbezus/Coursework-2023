import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWords } from './user-words.entity';

@Injectable()
export class UserWordsService {
  constructor(
    @InjectRepository(UserWords) private repo: Repository<UserWords>,
  ) {}

  async create(userId: number, wordId: number) {
    const existingWord = await this.repo.findOne({
      where: { userId, wordId },
    });
    if (!existingWord) {
      const newUserWord = this.repo.create({
        userId,
        wordId,
      });
      return this.repo.save(newUserWord);
    } else {
      return existingWord;
    }
  }

  async get(userId: number) {
    return this.repo.find({ where: { userId } });
  }
}
