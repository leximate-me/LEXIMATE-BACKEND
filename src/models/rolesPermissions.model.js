import { DataTypes } from 'sequelize';
import { connectDB } from '../database/db.js';

const sequelize = await connectDB();

const RolePermission = sequelize.define(
  'RolePermission',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'roles_permissions',
    timestamps: false,
  }
);

const defineRolesPermissions = async () => {
  try {
    const rolesPermissions = await RolePermission.findAll();
    if (rolesPermissions.length === 0) {
      await RolePermission.bulkCreate([
        { roles_fk: 1, permissions_fk: 1 },
        { roles_fk: 1, permissions_fk: 2 },
        { roles_fk: 1, permissions_fk: 3 },
        { roles_fk: 1, permissions_fk: 4 },
        { roles_fk: 2, permissions_fk: 2 },
        { roles_fk: 2, permissions_fk: 3 },
        { roles_fk: 2, permissions_fk: 4 },
        { roles_fk: 3, permissions_fk: 1 },
        { roles_fk: 3, permissions_fk: 2 },
        { roles_fk: 3, permissions_fk: 3 },
        { roles_fk: 3, permissions_fk: 4 },
        { roles_fk: 4, permissions_fk: 2 },
      ]);
      console.log('Roles y permisos asignados correctamente.');
    }
  } catch (error) {
    console.log('Error al definir roles y permisos:', error);
  }
};

export { RolePermission, defineRolesPermissions };
