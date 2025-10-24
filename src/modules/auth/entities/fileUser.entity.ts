import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './';

@Entity()
export class FileUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  file_id: string;

  @Column({ length: 100 })
  file_url: string;

  @Column({ length: 50 })
  file_type: string;

  @ManyToOne(() => User, (user) => user.fileUsers)
  user: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
