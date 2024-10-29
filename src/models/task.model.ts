import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: boolean;
  due_date: Date;
  classes_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface TaskCreationAttributes
  extends Optional<
    TaskAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: boolean;
  public due_date!: Date;
  public classes_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    classes_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'tasks',
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Task };
