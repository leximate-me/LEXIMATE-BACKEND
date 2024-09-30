import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const File = sequelize.define(
  'File',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING(50),
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
    file_url: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'files',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  }
);

export { File };
