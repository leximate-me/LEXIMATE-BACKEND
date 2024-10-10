import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Class = sequelize.define(
  'Class',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    class_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: 'classes',
    paranoid: true,
    timestamps: true,
    deleteAt: 'deleteAt',
  }
);

export { Class };
