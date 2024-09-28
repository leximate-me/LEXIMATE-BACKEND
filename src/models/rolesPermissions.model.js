import { DataTypes } from 'sequelize';
import { connectDB } from '../database/db.js';

const sequelize = await connectDB();

const RolePermission = sequelize.define(
  'RolePermission',
  {
    id: {
      type: DataTypes.INTEGER(11),
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
