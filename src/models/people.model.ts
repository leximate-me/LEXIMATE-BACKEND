import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db';

interface PeopleAttributes {
  id: number;
  first_name: string;
  last_name: string;
  dni: string;
  institute: string;
  phone_number: string;
  birth_date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PeopleCreationAttributes
  extends Optional<
    PeopleAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class People
  extends Model<PeopleAttributes, PeopleCreationAttributes>
  implements PeopleAttributes
{
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public dni!: string;
  public institute!: string;
  public phone_number!: string;
  public birth_date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

People.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    institute: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'people',
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { People, PeopleAttributes, PeopleCreationAttributes };
