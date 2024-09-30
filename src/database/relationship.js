import { Role } from '../models/roles.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolesPermissions.model.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';

User.belongsTo(People, { foreignKey: 'people_fk' });

User.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissions_fk' });
