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

// definir roles('Admin', 'Student', 'Teacher', 'Guest') con permisos
// 'create:classes', 'read:classes', 'update:classes', 'delete:classes',
// 'create:tasks', 'read:tasks', 'update:tasks', 'delete:tasks',
// 'create:users', 'read:users', 'update:users', 'delete:users',
// 'create:roles', 'read:roles', 'update:roles', 'delete:roles',
// 'create:permissions', 'read:permissions', 'update:permissions', 'delete:permissions'
const defineRolesPermissions = async () => {
  try {
    const rolesPermissions = await RolePermission.findAll();
    if (rolesPermissions.length === 0) {
      await RolePermission.bulkCreate([
        { roles_fk: 1, permissions_fk: 1 },
        { roles_fk: 1, permissions_fk: 2 },
        { roles_fk: 1, permissions_fk: 3 },
        { roles_fk: 1, permissions_fk: 4 },
        { roles_fk: 1, permissions_fk: 5 },
        { roles_fk: 1, permissions_fk: 6 },
        { roles_fk: 1, permissions_fk: 7 },
        { roles_fk: 1, permissions_fk: 8 },
        { roles_fk: 1, permissions_fk: 9 },
        { roles_fk: 1, permissions_fk: 10 },
        { roles_fk: 1, permissions_fk: 11 },
        { roles_fk: 1, permissions_fk: 12 },
        { roles_fk: 1, permissions_fk: 13 },
        { roles_fk: 1, permissions_fk: 14 },
        { roles_fk: 1, permissions_fk: 15 },
        { roles_fk: 1, permissions_fk: 16 },
        { roles_fk: 1, permissions_fk: 17 },
        { roles_fk: 1, permissions_fk: 18 },
        { roles_fk: 1, permissions_fk: 19 },
        { roles_fk: 1, permissions_fk: 20 },
        { roles_fk: 2, permissions_fk: 2 },
        { roles_fk: 2, permissions_fk: 6 },
        { roles_fk: 2, permissions_fk: 7 },
        { roles_fk: 2, permissions_fk: 11 },
        { roles_fk: 3, permissions_fk: 1 },
        { roles_fk: 3, permissions_fk: 2 },
        { roles_fk: 3, permissions_fk: 3 },
        { roles_fk: 3, permissions_fk: 4 },
        { roles_fk: 3, permissions_fk: 5 },
        { roles_fk: 3, permissions_fk: 6 },
        { roles_fk: 3, permissions_fk: 7 },
        { roles_fk: 3, permissions_fk: 8 },
        { roles_fk: 3, permissions_fk: 10 },
        { roles_fk: 4, permissions_fk: 2 },
        { roles_fk: 4, permissions_fk: 6 },
      ]);
      console.log('Roles y permisos creados correctamente.');
    }
  } catch (error) {
    console.log('Error al definir roles y permisos:', error);
  }
};

export { RolePermission, defineRolesPermissions };
