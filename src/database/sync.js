import { sequelize } from './db.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { Class } from '../models/class.model.js';
import { Task } from '../models/task.model.js';
import { UsersClasses } from '../models/userClass.model.js';
import { FileTask } from '../models/fileTask.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { Tool } from '../models/tool.model.js';
import { TaskTool } from '../models/taskTool.model.js';
import { defineRoles } from '../models/role.model.js';
import { definePermissions } from '../models/permission.model.js';
import { defineRolesPermissions } from '../models/rolePermission.model.js';
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
