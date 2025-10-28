import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { User } from '../../user/entities';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Course, (classEntity) => classEntity.posts, {
    nullable: false,
  })
  class: Course;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
