import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { People } from './people.entity';
import { Role } from './role.entity';
import { Course } from 'src/course/entities/course.entity';
import { TaskSubmission } from 'src/task/entities/task-submission.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @OneToOne(() => People, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  @JoinColumn()
  people: People;

  @OneToOne(() => Role, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  role: Role;

  @OneToMany(() => TaskSubmission, (submission) => submission.user)
  taskSubmissions: TaskSubmission[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => Course, (course) => course.users)
  @JoinTable()
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
