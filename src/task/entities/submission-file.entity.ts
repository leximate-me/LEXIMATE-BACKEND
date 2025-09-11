import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskSubmission } from './task-submission.entity';

@Entity()
export class SubmissionFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  filename: string;

  @Column({
    type: 'varchar',
  })
  path: string;

  @Column({
    type: 'varchar',
  })
  mimetype: string;

  @Column({
    type: 'varchar',
  })
  size: string;

  @ManyToOne(() => TaskSubmission, (submission) => submission.files, {
    onDelete: 'CASCADE',
  })
  submission: TaskSubmission;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
