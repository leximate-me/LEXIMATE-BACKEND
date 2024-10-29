import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface UserClassAttributes {
  id: number;
  users_fk: number;
  classes_fk: number;
}

interface UserClassCreationAttributes
  extends Optional<UserClassAttributes, 'id'> {}

class UserClass
  extends Model<UserClassAttributes, UserClassCreationAttributes>
  implements UserClassAttributes
{
  public id!: number;
  public users_fk!: number;
  public classes_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
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
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { UserClass };
