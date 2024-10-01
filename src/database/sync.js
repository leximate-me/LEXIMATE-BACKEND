import { connectDB } from './db.js';
import { sequelize } from './db.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';
import { Role } from '../models/roles.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolesPermissions.model.js';
import { Class } from '../models/class.js';
import { Task } from '../models/task.js';
import { UsersClasses } from '../models/usersClasses.js';
import { FileTask } from '../models/fileTask.js';
import { defineRoles } from '../models/roles.model.js';
import { definePermissions } from '../models/permission.model.js';
import { defineRolesPermissions } from '../models/rolesPermissions.model.js';
import './relationship.js';

const syncModels = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados correctamente.');
    await defineRoles();
    await definePermissions();
    await defineRolesPermissions();
  } catch (error) {
    console.log('Error al sincronizar los modelos:', error);
  }
};

syncModels();
