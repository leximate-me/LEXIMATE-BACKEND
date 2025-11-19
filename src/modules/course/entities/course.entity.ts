import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'varchar', length: 10 })
  class_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Task, (task) => task.course)
  tasks: Task[];

  @OneToMany(() => Post, (post) => post.course)
  posts: Post[];

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];
}
