import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'comments',
    timestamps: true,
    paraoid: true,
    deletedAt: 'deletedAt',
  }
);

export { Comment };
