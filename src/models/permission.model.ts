import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface PermissionAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PermissionCreationAttributes
  extends Optional<
    PermissionAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Permission.init(
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
    tableName: 'permissions',
    timestamps: true,
    paranoid: true,
    sequelize,
  }
);

export { Permission, PermissionAttributes, PermissionCreationAttributes };
