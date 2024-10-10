import { DataTypes } from 'sequelize';

import { sequelize } from '../database/db.js';

const Tool = sequelize.define(
  'Tool',
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
  },
  {
    tableName: 'tools',
    timestamps: true,
  }
);

export { Tool };
