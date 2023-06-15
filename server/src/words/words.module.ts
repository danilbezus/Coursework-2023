import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word } from './word.entity';
import { UserWordsModule } from 'src/user-words/user-words.module';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), UserWordsModule],
  providers: [WordsService],
  controllers: [WordsController],
})
export class WordsModule {}
