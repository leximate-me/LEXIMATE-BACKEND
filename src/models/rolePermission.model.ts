import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface RolePermissionAttributes {
  id: number;
  roles_fk: number;
  permissions_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface RolePermissionCreationAttributes
  extends Optional<
    RolePermissionAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: number;
  public roles_fk!: number;
  public permissions_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roles_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissions_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'roles_permissions',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export {
  RolePermission,
  RolePermissionAttributes,
  RolePermissionCreationAttributes,
};
