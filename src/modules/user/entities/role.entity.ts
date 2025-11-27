import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleEnum } from '@common/enums/role.enum';
import { User, Permission } from '.';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  name: RoleEnum;

  @Column({ type: 'varchar', length: 100 })
  description!: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
