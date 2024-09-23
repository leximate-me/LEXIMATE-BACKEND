import { Role, defineRoles } from '../models/roles.model.js';
import { User } from '../models/user.model.js';

const syncModels = async () => {
  try {
    await Role.sync({ alter: true }); // Usa { force: true } para recrear la tabla cada vez (útil para desarrollo)
    await User.sync({ alter: true }); // Usa { force: true } para recrear la tabla cada vez (útil para desarrollo)

    console.log('Modelo de Rol sincronizado con la base de datos');
    await defineRoles(); // Definir roles predeterminados
  } catch (error) {
    console.log('Error al sincronizar el modelo de Rol:', error);
  }
};

syncModels();
