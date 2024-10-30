import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db';

interface TaskToolAttributes {
  id: number;
  tasks_fk: number;
  tools_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface TaskToolCreationAttributes
  extends Optional<
    TaskToolAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class TaskTool
  extends Model<TaskToolAttributes, TaskToolCreationAttributes>
  implements TaskToolAttributes
{
  public id!: number;
  public tasks_fk!: number;
  public tools_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
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
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { TaskTool, TaskToolAttributes, TaskToolCreationAttributes };
