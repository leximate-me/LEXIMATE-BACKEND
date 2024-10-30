import crypto from 'crypto';
import { Class } from '../models/class.model';
import { UserClass } from '../models/userClass.model';
import { User } from '../models/user.model';
import { RolePermission } from '../models/rolePermission.model';
import { Role } from '../models/role.model';
import { sequelize } from '../database/db';
import { Task } from '../models/task.model';
import { Post } from '../models/post.model';
import { TokenPayload } from 'types/express';

interface ClassData {
  name: string;
  description: string;
}

// Función para crear una clase
const createClassService = async (classData: ClassData, user: TokenPayload) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description } = classData;
    if (!name || !description) {
      throw new Error('Faltan datos');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    if (!verifiedRole) {
      throw new Error('Rol no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole.id, permissions_fk: 1 },
      transaction,
    });

    if (!verifiedPermission) {
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

    await UserClass.create(
      {
        users_fk: foundUser.id,
        classes_fk: newClass.id,
      },
      { transaction }
    );

    await transaction.commit();

    return newClass;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Función para unirse a una clase
const joinClassService = async (classCode: string, user: TokenPayload) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    if (!verifiedRole) {
      throw new Error('Rol no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole.id, permissions_fk: 3 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

    const classData = await Class.findOne({
      where: { class_code: classCode },
      transaction,
    });

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    const foundUserClass = await UserClass.findOne({
      where: { users_fk: foundUser.id, classes_fk: classData.id },
      transaction,
    });

    if (foundUserClass) {
      throw new Error('Ya estás en esta clase');
    }

    await UserClass.create(
      {
        users_fk: foundUser.id,
        classes_fk: classData.id,
      },
      { transaction }
    );

    await transaction.commit();

    return classData;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Función para salir de una clase
const leaveClassService = async (classId: number, user: TokenPayload) => {
  const transaction = await sequelize.transaction();

  try {
    if (!classId) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole?.id, permissions_fk: 3 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

    const classData = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    await UserClass.destroy({
      where: { users_fk: foundUser.id, classes_fk: classData.id },
      transaction,
    });

    await transaction.commit();

    return classData;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// funcion para obtener las clases de un usuario
const getClassesByUserService = async (user: TokenPayload) => {
  const transaction = await sequelize.transaction();

  try {
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    if (!verifiedRole) {
      throw new Error('Rol no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole.id, permissions_fk: 2 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para ver una clase');
    }

    const userClass = await UserClass.findAll({
      where: { users_fk: foundUser.id },
      transaction,
    });

    if (userClass.length === 0) {
      throw new Error('No tienes clases');
    }

    const classes = await Class.findAll({
      where: { id: userClass.map((classData) => classData.classes_fk) },
      transaction,
    });

    await transaction.commit();

    return classes;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// funcion para obtener los usuarios de una clase
const getUsersByClassService = async (classId: number) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Código de clase no proporcionado');
    }
    const classData = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    const userClass = await UserClass.findAll({
      where: { classes_fk: classData.id },
      transaction,
    });

    if (userClass.length === 0) {
      throw new Error('No hay usuarios en esta clase');
    }

    const users = await User.findAll({
      where: { id: userClass.map((user) => user.users_fk) },
      transaction,
    });

    await transaction.commit();

    return users;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error();
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// funcion para actualizar una clase
const updateClassService = async (
  classId: number,
  classData: ClassData,
  user: TokenPayload
) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!classData) {
      throw new Error('Datos de clase no proporcionados');
    }

    const { name, description } = classData;

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    if (!verifiedRole) {
      throw new Error('Rol no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole.id, permissions_fk: 3 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para actualizar una clase');
    }

    const classFound = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classFound) {
      throw new Error('Clase no encontrada');
    }

    await Class.update(
      { name, description },
      {
        where: { id: classId },
        transaction,
      }
    );

    await transaction.commit();

    return classData;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// funcion para eliminar una clase
const deleteClassService = async (classId: number, user: TokenPayload) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    if (!verifiedRole) {
      throw new Error('Rol no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole.id, permissions_fk: 4 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para eliminar una clase');
    }

    const classFound = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classFound) {
      throw new Error('Clase no encontrada');
    }

    await Class.destroy({
      where: { id: classId },
      transaction,
    });

    await UserClass.destroy({
      where: { classes_fk: classFound.id },
      transaction,
    });

    await Task.destroy({
      where: { classes_fk: classFound.id },
      transaction,
    });

    await Post.destroy({
      where: { classes_fk: classFound.id },
      transaction,
    });

    await transaction.commit();

    return classFound;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido');
    }
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
