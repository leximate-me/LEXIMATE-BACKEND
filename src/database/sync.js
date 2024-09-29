import { Role } from '../models/roles.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolesPermissions.model.js';
import { RoleUser } from '../models/rolesUsers.model.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';

import { defineRoles } from '../models/roles.model.js';
import { definePermissions } from '../models/permission.model.js';
import { defineRolesPermissions } from '../models/rolesPermissions.model.js';
import './relationship.js';

const syncModels = async () => {
  try {
    await People.sync({ alter: true });
    await User.sync({ alter: true });
    await Role.sync({ alter: true }); //
    await Permission.sync({ alter: true });
    await RoleUser.sync({ alter: true });
    await RolePermission.sync({ alter: true });

    console.log('Modelos sincronizados correctamente.');
    await defineRoles();
    await definePermissions();
    await defineRolesPermissions();
  } catch (error) {
    console.log('Error al sincronizar los modelos:', error);
  }
};

syncModels();
