import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const UsersClasses = sequelize.define(
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
    timestamps: false,
  }
);

export { UsersClasses };
