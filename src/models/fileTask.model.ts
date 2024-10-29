import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface FileTaskAttributes {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_id: string;
  file_url: string;
  tasks_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface FileTaskCreationAttributes
  extends Optional<
    FileTaskAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class FileTask
  extends Model<FileTaskAttributes, FileTaskCreationAttributes>
  implements FileTaskAttributes
{
  public id!: number;
  public file_name!: string;
  public file_path!: string;
  public file_type!: string;
  public file_id!: string;
  public file_url!: string;
  public tasks_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

FileTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING(10),
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
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { FileTask, FileTaskAttributes, FileTaskCreationAttributes };
