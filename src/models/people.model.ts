import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../database/db';

class People extends Model<
  InferAttributes<People>,
  InferCreationAttributes<People>
> {
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare dni: string;
  declare institute: string;
  declare phone_number: string;
  declare birth_date: Date;
}

People.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
    modelName: 'People',
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { People };
