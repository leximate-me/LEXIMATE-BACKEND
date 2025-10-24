import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../entities';

@Entity()
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 8 })
  dni: string;

  @Column({ length: 100 })
  institute: string;

  @Column({ length: 15 })
  phone_number: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => User, (user) => user.people)
  users: User[];
}
