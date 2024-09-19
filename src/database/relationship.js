import { User } from '../models/user.model.js';
import { Role } from '../models/roles.model.js';

User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

Role.hasMany(User, {
  foreignKey: 'roleId',
  as: 'users',
});
