import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskSubmission } from './task-submission.entity';
import { Course } from 'src/course/entities/course.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  description: string;

  @Column({
    type: 'date',
  })
  dueDate: Date;

  @ManyToOne(() => Course, (course) => course.tasks)
  @JoinColumn()
  course: Course;

  @OneToMany(() => TaskSubmission, (submission) => submission.task)
  taskSubmissions: TaskSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
