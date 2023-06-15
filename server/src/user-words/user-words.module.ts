import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWordsService } from './user-words.service';
import { UserWordsController } from './user-words.controller';
import { UserWords } from './user-words.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWords])],
  providers: [UserWordsService],
  controllers: [UserWordsController],
  exports: [UserWordsService],
})
export class UserWordsModule {}
