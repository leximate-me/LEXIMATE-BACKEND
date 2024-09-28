import { User } from '../models/user.model.js';
import { Role } from '../models/roles.model.js';

User.belongsTo(Role, {
  foreignKey: 'role_fk',
  as: 'role',
});

Role.hasMany(User, {
  foreignKey: 'role_fk',
  as: 'users',
});
