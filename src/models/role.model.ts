import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db';

interface RoleAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface RoleCreationAttributes
  extends Optional<
    RoleAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Role, RoleAttributes, RoleCreationAttributes };
