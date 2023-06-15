import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
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

  async delete(userId: number, wordId: number) {
    let result: DeleteResult;
    if (userId) {
      result = await this.repo.delete({ userId, wordId });
    } else {
      result = await this.repo.delete({ wordId });
    }
    if (result.affected === 0) {
      return 'Слово не знайдено';
    }
    return 'Слово видалено';
  }
}
