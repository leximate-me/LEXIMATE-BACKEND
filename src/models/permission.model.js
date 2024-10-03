import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { logger } from '../configs/loggerConfig.js';

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
      allowNull: false,
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
      logger.info('Permisos creados correctamente.');
    }
  } catch (error) {
    logger.child({ error }).error('Error al definir roles y permisos');
  }
};

export { Permission, definePermissions };
