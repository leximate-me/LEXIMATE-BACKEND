import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
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
        {
          name: 'Create',
          description: 'Crear un registro.',
        },
        {
          name: 'Read',
          description: 'Leer un registro.',
        },
        {
          name: 'Update',
          description: 'Actualizar un registro.',
        },
        {
          name: 'Delete',
          description: 'Eliminar un registro.',
        },
      ]);
      console.log('Permisos creados correctamente.');
    }
  } catch (error) {
    console.log('Error al definir permisos:', error);
  }
};

export { Permission, definePermissions };
