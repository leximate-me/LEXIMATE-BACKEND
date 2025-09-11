import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 50,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 8,
  })
  dni: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  institute: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  phone_number: string;

  @Column({
    type: 'date',
  })
  birth_date: Date;

  @OneToOne(() => User, (user) => user.people)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
