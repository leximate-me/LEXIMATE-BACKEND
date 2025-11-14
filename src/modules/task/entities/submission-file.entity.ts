import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { TaskSubmission } from './task-submission.entity';

@Entity()
export class SubmissionFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  file_id: string;

  @Column({ type: 'varchar' })
  file_url: string;

  @Column({ type: 'varchar' })
  file_type: string;

  @ManyToOne(() => TaskSubmission, (submission) => submission.files)
  submission: TaskSubmission;

  @DeleteDateColumn()
  deletedAt?: Date;
}
