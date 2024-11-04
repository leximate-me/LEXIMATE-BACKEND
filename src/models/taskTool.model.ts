import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../database/db';

class TaskTool extends Model<
  InferAttributes<TaskTool>,
  InferCreationAttributes<TaskTool>
> {
  declare id: CreationOptional<number>;
  declare tasks_fk: number;
  declare tools_fk: number;
}

TaskTool.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tasks_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tools_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'tasks_tools',
    modelName: 'TaskTool',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { TaskTool };
