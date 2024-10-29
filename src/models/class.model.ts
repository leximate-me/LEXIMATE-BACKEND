import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface ClassAttributes {
  id: number;
  name: string;
  description: string;
  class_code: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'id'> {}

class Class
  extends Model<ClassAttributes, ClassCreationAttributes>
  implements ClassAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public class_code!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
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
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Class, ClassAttributes, ClassCreationAttributes };
