import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const UserClass = sequelize.define(
  'UsersClasses',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'users_classes',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  }
);

export { UserClass };
