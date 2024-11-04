import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../database/db';

class UserClass extends Model<
  InferAttributes<UserClass>,
  InferCreationAttributes<UserClass>
> {
  declare id: CreationOptional<number>;
  declare users_fk: number;
  declare classes_fk: number;
}

UserClass.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    users_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classes_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'users_classes',
    modelName: 'UserClass',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { UserClass };
