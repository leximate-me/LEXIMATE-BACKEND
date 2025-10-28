import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { FileTask } from './fileTask.entity';
import { Course } from '../../course/entities/course.entity';
import { Tool } from '../../tool/entities/tool.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column({ default: false })
  status: boolean;

  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @Column({ type: 'int', nullable: true })
  qualification: number;

  @ManyToOne(() => Course, (classEntity) => classEntity.tasks)
  course: Course;

  @OneToMany(() => FileTask, (fileTask) => fileTask.task)
  fileTasks: FileTask[];

  @ManyToMany(() => Tool, (tool) => tool.tasks)
  @JoinTable()
  tools: Tool[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
