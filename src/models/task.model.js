import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
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
