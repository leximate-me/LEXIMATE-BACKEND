import { DataTypes } from 'sequelize';
import { connectDB } from '../database/db.js';

const sequelize = await connectDB();

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
);

const defineRoles = async () => {
  try {
    const roles = await Role.findAll();
    if (roles.length === 0) {
      await Role.bulkCreate([
        {
          name: 'Admin',
          description:
            'Administrador del sistema, puede realizar cualquier acción.',
        },
        {
          name: 'Student',
          description:
            'Estudiante del sistema, puede realizar acciones de estudiantes.',
        },
        {
          name: 'Teacher',
          description:
            'Profesor del sistema, puede realizar acciones de profesores.',
        },
        {
          name: 'Guest',
          description: 'Usuario invitado, puede realizar acciones básicas.',
        },
      ]);
      console.log('Roles creados correctamente.');
    }
  } catch (error) {
    console.log('Error al definir roles:', error);
  }
};

export { Role, defineRoles };
