import { DataTypes } from 'sequelize';
import { connectDB } from '../database/db.js';
import { Role } from './roles.model.js';
const sequelize = await connectDB();

const User = sequelize.define(
  'User',
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
      type: DataTypes.INTEGER(8),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    institute: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
    },
  },
  {
    tableName: 'users',
    paranoid: true,
    timestamps: true,
    deleteAt: 'deleteAt',
  }
);

User.belongsTo(Role, {
  foreignKey: 'role_fk',
  as: 'role',
});

Role.hasMany(User, {
  foreignKey: 'role_fk',
  as: 'users',
});

export { User };
