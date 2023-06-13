import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserWords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  wordId: number;
}
