import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  translation: string;
  @Column()
  definition: string;

  @Column()
  example: string;

  @Column()
  pronunciation: string;

  @Column()
  partsOfSpeech: string;
}
