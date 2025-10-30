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

  @Column({ length: 100 })
  file_id: string;

  @Column()
  file_url: string;

  @Column({ length: 50 })
  file_type: string;

  @ManyToOne(() => TaskSubmission, (submission) => submission.files)
  submission: TaskSubmission;

  @DeleteDateColumn()
  deletedAt?: Date;
}
