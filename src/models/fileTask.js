import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const FileTask = sequelize.define(
  'FileTask',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    file_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'files_tasks',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
  }
);

export { FileTask };
