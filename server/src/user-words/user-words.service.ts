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
    const newUserWord = this.repo.create({
      userId,
      wordId,
    });
    return this.repo.save(newUserWord);
  }
}
