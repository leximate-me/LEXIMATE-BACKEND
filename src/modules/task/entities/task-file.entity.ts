import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskFile {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar' })
  file_id: string;

  @Column({ type: 'varchar' })
  file_url: string;

  @Column({ type: 'varchar' })
  file_type: string;

  @ManyToOne(() => Task, (task) => task.taskFiles)
  task: Task;

  @DeleteDateColumn()
  deletedAt?: Date;
}
