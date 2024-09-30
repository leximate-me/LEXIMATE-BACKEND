import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Class = sequelize.define(
  'Class',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    class_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    class_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: 'classes',
    paranoid: true,
    timestamps: false,
    deleteAt: 'deleteAt',
  }
);

export { Class };
