import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'text',
  })
  user_name: string;
  @Column({
    type: 'text',
  })
  email: string;
  @Column({
    type: 'text',
  })
  password: string;
  @Column({
    type: 'boolean',
  })
  verified: boolean;
}
