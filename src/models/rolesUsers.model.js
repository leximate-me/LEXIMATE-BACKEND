import { DataTypes } from 'sequelize';

import { connectDB } from '../database/db.js';

const sequelize = await connectDB();

const RoleUser = sequelize.define(
  'RoleUser',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'roles_users',
    timestamps: false,
  }
);

export { RoleUser };
