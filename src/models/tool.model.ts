import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db';

interface ToolAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ToolCreationAttributes
  extends Optional<
    ToolAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Tool
  extends Model<ToolAttributes, ToolCreationAttributes>
  implements ToolAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Tool.init(
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
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Tool, ToolAttributes, ToolCreationAttributes };
