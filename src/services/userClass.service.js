import crypto from 'crypto';
import { Class } from '../models/class.model.js';
import { UsersClasses } from '../models/userClass.model.js';
import { User } from '../models/user.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { sequelize } from '../database/db.js';

// Función para crear una clase
const createClassService = async (classData, user) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description } = classData;
    if (!name || !description) {
      throw new Error('Faltan datos');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const verifyPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 1 },
      },
      { transaction }
    );

    if (!verifyPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

    const class_code = crypto.randomBytes(5).toString('hex');

    const newClass = await Class.create(
      {
        name,
        description,
        class_code,
      },
      { transaction }
    );

    await UsersClasses.create(
      {
        users_fk: user.id,
        classes_fk: newClass.id,
      },
      { transaction }
    );

    await transaction.commit();

    return newClass;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

// Función para unirse a una clase
const joinClassService = async (classCode, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const verifyPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 3 },
      },
      { transaction }
    );

    if (!verifyPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

    const classData = await Class.findOne(
      { where: { class_code: classCode } },
      { transaction }
    );

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    const foundUserClass = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: classData.id },
      },
      { transaction }
    );

    if (foundUserClass) {
      throw new Error('Ya estás en esta clase');
    }

    await UsersClasses.create(
      {
        users_fk: user.id,
        classes_fk: classData.id,
      },
      { transaction }
    );

    await transaction.commit();

    return classData;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

// Función para salir de una clase
const leaveClassService = async (classCode, user) => {
  const transaction = await sequelize.transaction();

  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const verifyPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 3 },
      },
      { transaction }
    );

    if (!verifyPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

    const classData = await Class.findOne(
      { where: { class_code: classCode } },
      { transaction }
    );

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    await UsersClasses.destroy(
      {
        where: { users_fk: user.id, classes_fk: classData.id },
      },
      { transaction }
    );

    await transaction.commit();

    return classData;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

// funcion para obtener las clases de un usuario
const getClassesByUserService = async (user) => {
  const transaction = await sequelize.transaction();

  try {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const verifyPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 2 },
      },
      { transaction }
    );

    if (!verifyPermission) {
      throw new Error('No tienes los permisos para ver una clase');
    }

    const userClass = await UsersClasses.findAll(
      {
        where: { users_fk: user.id },
        // include: {
        //   model: Class,
        //   attributes: ['name', 'description', 'class_code'],
        // },
      },
      { transaction }
    );

    if (userClass.length === 0) {
      throw new Error('No tienes clases');
    }

    const classes = await Class.findAll(
      {
        where: { id: userClass.map((classData) => classData.classes_fk) },
        attributes: ['name', 'description', 'class_code'],
      },
      { transaction }
    );

    await transaction.commit();

    return classes;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

// funcion para obtener los usuarios de una clase
const getUsersByClassService = async (classCode) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }
    const classData = await Class.findOne(
      { where: { class_code: classCode } },
      { transaction }
    );

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    const userClass = await UsersClasses.findAll(
      {
        where: { classes_fk: classData.id },
      },
      { transaction }
    );

    if (userClass.length === 0) {
      throw new Error('No hay usuarios en esta clase');
    }

    const users = await User.findAll(
      {
        where: { id: userClass.map((user) => user.users_fk) },
        attributes: ['user_name', 'roles_fk', 'email'],
      },
      { transaction }
    );

    await transaction.commit();

    return users;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

// funcion para actualizar una clase
const updateClassService = async (classCode, classData, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verifyPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 3 },
      },
      { transaction }
    );

    if (!verifyPermission) {
      throw new Error('No tienes los permisos para actualizar una clase');
    }

    const classFound = await Class.findOne(
      {
        where: { class_code: classCode },
      },
      { transaction }
    );

    if (!classFound) {
      throw new Error('Clase no encontrada');
    }

    if (!user.rol === 'teacher') {
      throw new Error('No tiene permisos para actualizar la clase');
    }

    await Class.update(
      classData,
      {
        where: { class_code: classCode },
      },
      { transaction }
    );

    await transaction.commit();

    return classData;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

// funcion para eliminar una clase
const deleteClassService = async (classCode, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verifyPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 4 },
      },
      { transaction }
    );

    if (!verifyPermission) {
      throw new Error('No tienes los permisos para eliminar una clase');
    }

    const classFound = await Class.findOne(
      {
        where: { class_code: classCode },
      },
      { transaction }
    );

    if (!classFound) {
      throw new Error('Clase no encontrada');
    }

    await Class.destroy(
      {
        where: { class_code: classCode },
      },
      { transaction }
    );

    await UsersClasses.destroy(
      {
        where: { classes_fk: classFound.id },
      },
      { transaction }
    );

    await transaction.commit();

    return classFound;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
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
