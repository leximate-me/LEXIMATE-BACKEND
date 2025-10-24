import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity('tools')
export class Tool {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  description: string;

  @ManyToMany(() => Task, (task) => task.tools)
  tasks: Task[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
