import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from '../../user/entities/user.entity';
import { SubmissionFile } from './submission-file.entity';
import { TaskStatus } from '../../../common/enums/task-status';
TaskStatus;
@Entity()
export class TaskSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  qualification?: number;

  @ManyToOne(() => Task, (task) => task.submissions)
  task: Task;

  @ManyToOne(() => User, (user) => user.taskSubmissions)
  user: User;

  @OneToMany(() => SubmissionFile, (file) => file.submission, {
    cascade: true,
  })
  files: SubmissionFile[];

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
