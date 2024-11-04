import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../database/db';

class Class extends Model<
  InferAttributes<Class>,
  InferCreationAttributes<Class>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare class_code: string;
}

Class.init(
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
    modelName: 'Class',
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Class };
