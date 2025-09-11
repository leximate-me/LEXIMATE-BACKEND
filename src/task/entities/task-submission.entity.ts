import { TaskStatus } from 'src/common/enums/task-status.enum';
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
import { Task } from './task.entity';
import { User } from 'src/user/entities';
import { SubmissionFile } from './submission-file.entity';

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

  @ManyToOne(() => Task, (task) => task.taskSubmissions)
  @JoinColumn({ name: 'task_fk' })
  task: Task;

  @ManyToOne(() => User, (user) => user.taskSubmissions)
  @JoinColumn({ name: 'user_fk' })
  user: User;

  @OneToMany(() => SubmissionFile, (file) => file.submission, {
    cascade: ['insert', 'update'],
  })
  files: SubmissionFile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
