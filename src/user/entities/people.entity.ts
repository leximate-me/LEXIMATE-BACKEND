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
  firstName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  lastName: string;

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
  phoneNumber: string;

  @Column({
    type: 'date',
  })
  birthDate: Date;

  @OneToOne(() => User, (user) => user.people)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
