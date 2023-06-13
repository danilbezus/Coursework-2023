import { Test, TestingModule } from '@nestjs/testing';
import { UserWordsController } from './user-words.controller';

describe('UserWordsController', () => {
  let controller: UserWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWordsController],
    }).compile();

    controller = module.get<UserWordsController>(UserWordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
