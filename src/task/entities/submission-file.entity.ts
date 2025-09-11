import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
  fileName: string;

  @Column({
    type: 'varchar',
  })
  path: string;

  @Column({
    type: 'varchar',
  })
  mimeType: string;

  @Column({
    type: 'varchar',
  })
  size: string;

  @ManyToOne(() => TaskSubmission, (submission) => submission.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  taskSubmission: TaskSubmission;
}
