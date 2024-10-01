import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const People = sequelize.define(
  'People',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    institute: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'people',
    paranoid: true,
    timestamps: false,
    deleteAt: 'deleteAt',
  }
);

export { People };
