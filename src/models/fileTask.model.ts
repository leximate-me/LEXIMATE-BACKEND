import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../database/db';

class FileTask extends Model<
  InferAttributes<FileTask>,
  InferCreationAttributes<FileTask>
> {
  declare id: CreationOptional<number>;
  declare file_type: string;
  declare file_id: string;
  declare file_url: string;
  declare tasks_fk: number;
}

FileTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_type: {
      type: DataTypes.STRING(50),
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
    tasks_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'files_tasks',
    modelName: 'FileTask',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { FileTask };
