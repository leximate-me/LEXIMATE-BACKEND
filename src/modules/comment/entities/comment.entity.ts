import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../auth/entities';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
