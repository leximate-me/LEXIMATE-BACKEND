import { generateRandomCode } from 'src/common/utils/generate-random-code.util';
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

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];

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
  course_code: string;

  @OneToMany(() => Task, (task) => task.course)
  tasks: Task;

  @BeforeInsert()
  generateCode() {
    this.course_code = generateRandomCode();
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
