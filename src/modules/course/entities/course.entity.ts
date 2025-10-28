import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 10 })
  class_code: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Task, (task) => task.class)
  tasks: Task[];

  @OneToMany(() => Post, (post) => post.course)
  posts: Post[];

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];
}
