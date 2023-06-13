import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WordsModule } from './words/words.module';
import { ParsingModule } from './words/parsing.module';
import { Word } from './words/word.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Word],
      synchronize: true,
    }),
    WordsModule,
    ParsingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
