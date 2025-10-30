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

import { TaskFile } from './task-file.entity';
import { Course } from '../../course/entities/course.entity';
import { TaskSubmission } from './task-submission.entity';

@Entity()
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

  @ManyToOne(() => Course, (course) => course.tasks)
  course: Course;

  @OneToMany(() => TaskFile, (taskFile) => taskFile.task, {
    eager: true,
    onDelete: 'CASCADE',
  })
  taskFiles: TaskFile[];

  @OneToMany(() => TaskSubmission, (submission) => submission.task)
  submissions: TaskSubmission[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
