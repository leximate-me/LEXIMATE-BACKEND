import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '.';

@Entity()
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  file_id: string;

  @Column({ type: 'varchar' })
  file_url: string;

  @Column({ type: 'varchar' })
  file_type: string;

  @ManyToOne(() => User, (user) => user.userFiles, { onDelete: 'CASCADE' })
  user: User;
}
