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
import { Post } from '../models/post.js';
import { Comment } from '../models/comment.js';
import { defineRoles } from '../models/roles.model.js';
import { definePermissions } from '../models/permission.model.js';
import { defineRolesPermissions } from '../models/rolesPermissions.model.js';
import './relationship.js';
import { logger } from '../configs/loggerConfig.js';

const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    await defineRoles();
    await definePermissions();
    await defineRolesPermissions();
    logger.info('Modelos sincronizados correctamente.');
  } catch (error) {
    logger.error('Error al sincronizar los modelos:', error);
  }
};

export { syncModels };
