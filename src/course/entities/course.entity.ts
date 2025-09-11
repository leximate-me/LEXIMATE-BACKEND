import { generateRandomCode } from 'src/common/utils/generate-random-code.util';
import { Post } from 'src/post/entities/post.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 7,
  })
  courseCode: string;

  @OneToMany(() => Task, (task) => task.course)
  tasks: Task;

  @OneToMany(() => Post, (post) => post.course)
  posts: Post[];

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt?: Date;

  @BeforeInsert()
  generateCode() {
    this.courseCode = generateRandomCode();
  }
}
