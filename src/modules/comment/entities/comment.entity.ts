import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    eager: true,
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  users: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
