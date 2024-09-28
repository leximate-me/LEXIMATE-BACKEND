import { Role } from '../models/roles.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolesPermissions.model.js';
import { RoleUser } from '../models/rolesUsers.model.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';

RolePermission.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissions_fk' });

RoleUser.belongsTo(Role, { foreignKey: 'roles_fk' });

RoleUser.belongsTo(User, { foreignKey: 'users_fk' });

User.belongsTo(People, { foreignKey: 'people_fk' });
