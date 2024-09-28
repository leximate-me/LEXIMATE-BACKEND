import { connectDB } from './db.js';
import { defineRoles } from '../models/roles.model.js';
import { definePermissions } from '../models/permission.model.js';
import { defineRolesPermissions } from '../models/rolesPermissions.model.js';
import './relationship.js';

const syncModels = async () => {
  try {
    const sequelize = await connectDB();
    await sequelize.sync({ force: true });
    console.log('Modelos sincronizados correctamente.');
    await defineRoles();
    await definePermissions();
    await defineRolesPermissions();
  } catch (error) {
    console.log('Error al sincronizar los modelos:', error);
  }
};

syncModels();
