import crypto from 'crypto';
import { Class } from '../models/class.model';
import { UserClass } from '../models/userClass.model';
import { User } from '../models/user.model';
import { RolePermission } from '../models/rolePermission.model';
import { Role } from '../models/role.model';
import { sequelize } from '../database/db';
import { Task } from '../models/task.model';
import { Post } from '../models/post.model';


/**
 * Crea una nueva clase.
 * @param classData - Los datos de la clase a crear.
 * @param userId - El ID del usuario que crea la clase.
 * @returns La clase creada.
 * @throws Si ocurre un error durante la creación de la clase.
 */

const createClassService = async (classData: Class, userId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description } = classData;

    const foundUser = await User.findOne({
      where: { id: userId },
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
    throw error;
  }
};

// Función para unirse a una clase
const joinClassService = async (classCode: string, userId: number) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classCode) {
      throw new Error('Código de clase no proporcionado');
    }

    if (!userId) {
      throw new Error('Usuario no proporcionado');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const [classData, foundUserClass, verifiedPermission] = await Promise.all([
      Class.findOne({
        where: { class_code: classCode },
        transaction,
      }),
      UserClass.findOne({
        where: { users_fk: foundUser.id },
        transaction,
      }),
      RolePermission.findOne({
        where: { roles_fk: foundUser.roles_fk, permissions_fk: 3 },
        transaction,
      }),
    ]);

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

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
    throw error;
  }
};

// Función para salir de una clase
const leaveClassService = async (classId: number, userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    if (!classId) {
      throw new Error('Clase no proporcionada');
    }

    if (!userId) {
      throw new Error('Usuario no proporcionado');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const [verifiedPermission, classData] = await Promise.all([
      RolePermission.findOne({
        where: { roles_fk: foundUser.roles_fk, permissions_fk: 3 },
        transaction,
      }),
      Class.findOne({
        where: { id: classId },
        transaction,
      }),
    ]);

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para crear una clase');
    }

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
    throw error;
  }
};

// funcion para obtener las clases de un usuario
const getClassesByUserService = async (userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const [verifiedPermission, userClass, classes] = await Promise.all([
      RolePermission.findOne({
        where: { roles_fk: foundUser.roles_fk, permissions_fk: 2 },
        transaction,
      }),
      UserClass.findAll({
        where: { users_fk: foundUser.id },
        transaction,
      }),
      Class.findAll({ transaction }),
    ]);

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para ver una clase');
    }

    if (userClass.length === 0) {
      throw new Error('No tienes clases');
    }

    await transaction.commit();

    return classes;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// funcion para obtener los usuarios de una clase
const getUsersByClassService = async (classId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const classData = await Class.findByPk(classId, { transaction });

    if (!classData) {
      throw new Error('Clase no encontrada');
    }

    const [userClass, users] = await Promise.all([
      UserClass.findAll({
        where: { classes_fk: classData.id },
        transaction,
      }),
      User.findAll({ transaction }),
    ]);

    if (userClass.length === 0) {
      throw new Error('No hay usuarios en esta clase');
    }

    if (users.length === 0) {
      throw new Error('No hay usuarios');
    }

    await transaction.commit();

    return users;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// funcion para actualizar una clase
const updateClassService = async (
  classId: number,
  classData: Class,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, description } = classData;

    if (!userId) {
      throw new Error('Usuario no proporcionado');
    }

    if (!classId || !classData) {
      throw new Error('Clase no proporcionada');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const [verifiedPermission, classFound] = await Promise.all([
      RolePermission.findOne({
        where: { roles_fk: foundUser.roles_fk, permissions_fk: 3 },
        transaction,
      }),
      Class.findByPk(classId, { transaction }),
    ]);

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para actualizar una clase');
    }

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
    throw error;
  }
};

// funcion para eliminar una clase
const deleteClassService = async (classId: number, userId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const foundUser = await User.findByPk(userId, { transaction });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const [verifiedPermission, classFound] = await Promise.all([
      RolePermission.findOne({
        where: { roles_fk: foundUser.roles_fk, permissions_fk: 4 },
        transaction,
      }),
      Class.findByPk(classId, { transaction }),
    ]);

    if (!verifiedPermission) {
      throw new Error('No tienes los permisos para eliminar una clase');
    }

    if (!classFound) {
      throw new Error('Clase no encontrada');
    }

    Promise.all([
      Class.destroy({
        where: { id: classId },
        transaction,
      }),
      UserClass.destroy({
        where: { classes_fk: classFound.id },
        transaction,
      }),
      Task.destroy({
        where: { classes_fk: classFound.id },
        transaction,
      }),
      Post.destroy({
        where: { classes_fk: classFound.id },
        transaction,
      }),
    ]);

    await transaction.commit();

    return classFound;
  } catch (error) {
    await transaction.rollback();
    throw error;
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
