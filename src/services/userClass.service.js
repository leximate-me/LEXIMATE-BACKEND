import { Class } from '../models/class.js';
import { UsersClasses } from '../models/usersClasses.js';
import { User } from '../models/user.model.js';
import crypto from 'crypto';
import { RolePermission } from '../models/rolesPermissions.model.js';

// Función para crear una clase
const createClassService = async (classData, user) => {
  const { name, description } = classData;
  if (!name || !description) {
    throw new Error('Faltan datos');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 1 },
  });

  if (!verifyPermission) {
    throw new Error('No tienes los permisos para crear una clase');
  }

  const class_code = crypto.randomBytes(5).toString('hex');

  const newClass = await Class.create({
    name,
    description,
    class_code,
  });

  await UsersClasses.create({
    users_fk: user.id,
    classes_fk: newClass.id,
  });

  return newClass;
};

// Función para unirse a una clase
const joinClassService = async (classCode, user) => {
  if (!classCode) {
    throw new Error('Código de clase no proporcionado');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 3 },
  });

  if (!verifyPermission) {
    throw new Error('No tienes los permisos para crear una clase');
  }

  const classData = await Class.findOne({ where: { class_code: classCode } });

  if (!classData) {
    throw new Error('Clase no encontrada');
  }

  const foundUserClass = await UsersClasses.findOne({
    where: { users_fk: user.id, classes_fk: classData.id },
  });

  if (foundUserClass) {
    throw new Error('Ya estás en esta clase');
  }

  await UsersClasses.create({
    users_fk: user.id,
    classes_fk: classData.id,
  });

  return classData;
};

// Función para salir de una clase
const leaveClassService = async (classCode, user) => {
  if (!classCode) {
    throw new Error('Código de clase no proporcionado');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 3 },
  });

  if (!verifyPermission) {
    throw new Error('No tienes los permisos para crear una clase');
  }

  const classData = await Class.findOne({ where: { class_code: classCode } });

  if (!classData) {
    throw new Error('Clase no encontrada');
  }

  await UsersClasses.destroy({
    where: { users_fk: user.id, classes_fk: classData.id },
  });

  return classData;
};

// funcion para obtener las clases de un usuario
const getClassesByUserService = async (user) => {
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 2 },
  });

  if (!verifyPermission) {
    throw new Error('No tienes los permisos para ver una clase');
  }

  const classes = await UsersClasses.findAll({
    where: { users_fk: user.id },
    include: {
      model: Class,
      attributes: ['name', 'description', 'class_code'],
    },
  });

  if (classes.length === 0) {
    throw new Error('No hay clases disponibles');
  }

  return classes;
};

// funcion para obtener los usuarios de una clase
const getUsersByClassService = async (classCode) => {
  if (!classCode) {
    throw new Error('Código de clase no proporcionado');
  }

  const classData = await Class.findOne({ where: { class_code: classCode } });

  if (!classData) {
    throw new Error('Clase no encontrada');
  }

  const users = await UsersClasses.findAll({
    where: { classes_fk: classData.id },
    include: {
      model: User,
      attributes: ['user_name', 'roles_fk', 'email'],
    },
  });

  return users;
};

// funcion para actualizar una clase
const updateClassService = async (classCode, classData, user) => {
  if (!classCode) {
    throw new Error('Código de clase no proporcionado');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 3 },
  });

  if (!verifyPermission) {
    throw new Error('No tienes los permisos para actualizar una clase');
  }

  const classFound = await Class.findOne({ where: { class_code: classCode } });

  if (!classFound) {
    throw new Error('Clase no encontrada');
  }

  if (!user.rol === 'teacher') {
    throw new Error('No tiene permisos para actualizar la clase');
  }

  await Class.update(classData, {
    where: { class_code: classCode },
  });

  return classData;
};

// funcion para eliminar una clase
const deleteClassService = async (classCode, user) => {
  if (!classCode) {
    throw new Error('Código de clase no proporcionado');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 4 },
  });

  if (!verifyPermission) {
    throw new Error('No tienes los permisos para eliminar una clase');
  }

  const classFound = await Class.findOne({ where: { class_code: classCode } });

  if (!classFound) {
    throw new Error('Clase no encontrada');
  }

  await Class.destroy({
    where: { class_code: classCode },
  });

  return classFound;
};

export {
  createClassService,
  joinClassService,
  leaveClassService,
  getClassesByUserService,
  getUsersByClassService,
  updateClassService,
  deleteClassService,
};
