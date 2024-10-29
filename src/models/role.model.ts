import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface RoleAttributes {
  id: number;
  name: string;
  description: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
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
    tableName: 'roles',
    timestamps: false,
    sequelize,
  }
);

export { Role };
