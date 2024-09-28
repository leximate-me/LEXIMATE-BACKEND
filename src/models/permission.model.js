import { DataTypes } from 'sequelize';
import { connectDB } from '../database/db.js';

const sequelize = await connectDB();

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'permissions',
    timestamps: false,
  }
);

const definePermissions = async () => {
  try {
    const permissions = await Permission.findAll();
    if (permissions.length === 0) {
      await Permission.bulkCreate([
        { name: 'create:classes', description: 'Crear clases.' },
        { name: 'read:classes', description: 'Leer clases.' },
        { name: 'update:classes', description: 'Actualizar clases.' },
        { name: 'delete:classes', description: 'Eliminar clases.' },
        { name: 'create:tasks', description: 'Crear tareas.' },
        { name: 'read:tasks', description: 'Leer tareas.' },
        { name: 'update:tasks', description: 'Actualizar tareas.' },
        { name: 'delete:tasks', description: 'Eliminar tareas.' },
        { name: 'create:users', description: 'Crear usuarios.' },
        { name: 'read:users', description: 'Leer usuarios.' },
        { name: 'update:users', description: 'Actualizar usuarios.' },
        { name: 'delete:users', description: 'Eliminar usuarios.' },
        { name: 'create:roles', description: 'Crear roles.' },
        { name: 'read:roles', description: 'Leer roles.' },
        { name: 'update:roles', description: 'Actualizar roles.' },
        { name: 'delete:roles', description: 'Eliminar roles.' },
        { name: 'create:permissions', description: 'Crear permisos.' },
        { name: 'read:permissions', description: 'Leer permisos.' },
        { name: 'update:permissions', description: 'Actualizar permisos.' },
        { name: 'delete:permissions', description: 'Eliminar permisos.' },
      ]);
      console.log('Permisos creados correctamente.');
    }
  } catch (error) {
    console.log('Error al definir permisos:', error);
  }
};

export { Permission, definePermissions };
