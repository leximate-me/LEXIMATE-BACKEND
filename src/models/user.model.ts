import { DataTypes, Optional, Model } from 'sequelize';
import { sequelize } from '../database/db.js';

interface UserAttributes {
  id: number;
  user_name: string;
  email: string;
  password: string;
  verified: boolean;
  people_fk: number;
  roles_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: number;
  user_name!: string;
  email!: string;
  password!: string;
  verified!: boolean;
  people_fk!: number;
  roles_fk!: number;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    people_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roles_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { User, UserAttributes, UserCreationAttributes };
