import { Role } from '../models/roles.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolesPermissions.model.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';
import { Class } from '../models/class.js';
import { Task } from '../models/task.js';
import { UsersClasses } from '../models/usersClasses.js';
import { FileTask } from '../models/fileTask.js';

User.belongsTo(People, { foreignKey: 'people_fk' });

User.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissions_fk' });

Task.belongsTo(Class, { foreignKey: 'classes_fk' });

UsersClasses.belongsTo(User, { foreignKey: 'users_fk' });

UsersClasses.belongsTo(Class, { foreignKey: 'classes_fk' });

FileTask.belongsTo(Task, { foreignKey: 'tasks_fk' });
