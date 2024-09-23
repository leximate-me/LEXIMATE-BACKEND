import { DataTypes } from 'sequelize';
import { connectDB } from '../database/db.js';

const sequelize = await connectDB();

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
);

const defineRoles = async () => {
  const roles = ['Admin', 'Teacher', 'Student', 'Guest'];

  for (const roleName of roles) {
    const [role, created] = await Role.findOrCreate({
      where: { name: roleName },
      defaults: { name: roleName },
    });

    if (created) {
      console.log(`Roles ${roleName} creado.`);
    } else {
      console.log(`Roles ${roleName} ya existe.`);
    }
  }
};

export { Role, defineRoles };
