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
import { Notification } from '@notification/entities/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  user_name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'bool', default: false })
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

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => TaskSubmission, (submission) => submission.user)
  taskSubmissions: TaskSubmission[];

  @OneToMany(() => UserFile, (userFile) => userFile.user, { eager: true })
  userFiles: UserFile[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
