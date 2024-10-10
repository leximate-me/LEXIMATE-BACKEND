import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const TaskTool = sequelize.define(
  'TaskTool',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'tasks_tools',
    timestamps: false,
  }
);

export { TaskTool };
