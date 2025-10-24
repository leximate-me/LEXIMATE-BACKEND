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
import { FileUser } from './fileUser.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  user_name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @ManyToOne(() => People, (people) => people.users, { nullable: false })
  people: People;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  role: Role;

  @ManyToMany(() => Course, (course) => course.users)
  @JoinTable()
  courses: Course[];

  @OneToMany(() => FileUser, (fileUser) => fileUser.user)
  fileUsers: FileUser[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
