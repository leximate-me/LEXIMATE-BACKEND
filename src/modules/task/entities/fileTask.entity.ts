import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('files_tasks')
export class FileTask {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100 })
  file_id: string;

  @Column()
  file_url: string;

  @Column({ length: 50 })
  file_type: string;

  @ManyToOne(() => Task, (task) => task.fileTasks)
  task: Task;

  @DeleteDateColumn()
  deletedAt?: Date;
}
