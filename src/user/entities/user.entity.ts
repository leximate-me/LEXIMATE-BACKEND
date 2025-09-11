import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { People } from './people.entity';
import { Role } from './role.entity';
import { Course } from 'src/course/entities/course.entity';
import { TaskSubmission } from 'src/task/entities/task-submission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => People, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'people_fk' })
  people: People;

  @OneToOne(() => Role, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_fk' })
  role: Role;

  @ManyToMany(() => Course, (course) => course.users)
  @JoinTable({
    // Opcional: para cambiar el nombre de la tabla intermedia
    // name: 'user_courses_course',
    joinColumn: {
      name: 'user_fk', // Nombre de la columna para la entidad User
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'course_fk', // Nombre de la columna para la entidad Course
      referencedColumnName: 'id',
    },
  })
  courses: Course[];

  @Column({
    type: 'varchar',
    length: 50,
  })
  user_name: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    type: 'boolean',
  })
  verified: boolean;

  @OneToMany(() => TaskSubmission, (submission) => submission.user)
  taskSubmissions: TaskSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
