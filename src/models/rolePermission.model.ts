import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { logger } from '../configs/loggerConfig.js';

const RolePermission = sequelize.define(
  'RolePermission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'roles_permissions',
    timestamps: false,
  }
);

export { RolePermission };
