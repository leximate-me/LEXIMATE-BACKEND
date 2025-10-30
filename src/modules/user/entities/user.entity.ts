import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Course } from '../../course/entities/course.entity';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { People } from './people.entity';
import { Role } from './role.entity';
import { UserFile } from './user-file.entity';
import { TaskSubmission } from '../../task/entities/task-submission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  user_name: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @ManyToOne(() => People, (people) => people.users, {
    nullable: false,
    eager: true,
  })
  people: People;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false, eager: true })
  role: Role;

  @ManyToMany(() => Course, (course) => course.users)
  @JoinTable()
  courses: Course[];

  @OneToMany(() => TaskSubmission, (submission) => submission.user)
  taskSubmissions: TaskSubmission[];

  @OneToMany(() => UserFile, (userFile) => userFile.user, { eager: true })
  userFiles: UserFile[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.users)
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
