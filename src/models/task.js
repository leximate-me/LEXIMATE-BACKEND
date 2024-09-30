import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: 'tasks',
    paranoid: true,
    timestamps: true,
    deleteAt: 'deleteAt',
  }
);

export { Task };
