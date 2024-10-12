import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { logger } from '../configs/loggerConfig.js';

const Role = sequelize.define(
  'Role',
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
      logger.info('Roles creados correctamente.');
    }
  } catch (error) {
    logger.child({ error }).error('Error al definir roles y permisos');
  }
};

export { Role, defineRoles };
