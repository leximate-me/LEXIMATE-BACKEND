import { UserClass } from '../models/userClass.model';
import { User } from '../models/user.model';
import { Class } from '../models/class.model';
import { Task } from '../models/task.model';
import { FileTask } from '../models/fileTask.model';
import { RolePermission } from '../models/rolePermission.model';
import { Role } from '../models/role.model';
import { sequelize } from '../database/db';
import { deleteFromCloudinary } from '../middlewares/upload.middleware';

// Función para crear una tarea
const createTaskService = async (
  classId: number,
  userId: number,
  taskData: Task,
  fileProps: any
) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, description, status, due_date } = taskData;

    const { fileUrl, fileId, fileType } = fileProps;

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

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole?.id, permissions_fk: 1 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para crear una tarea');
    }

    const classCodeMatch = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classCodeMatch) {
      throw new Error('Clase no encontrada');
    }

    const classData = await UserClass.findOne({
      where: { users_fk: userId, classes_fk: classCodeMatch.id },
      transaction,
    });

    if (!classData) {
      throw new Error('No perteneces a esta clase');
    }

    const newTask = await Task.create(
      {
        title,
        description,
        status,
        due_date,
        classes_fk: classData.classes_fk,
      },
      { transaction }
    );

    if (fileProps) {
      await FileTask.create(
        {
          file_type: fileType,
          file_id: fileId,
          file_url: fileUrl,
          tasks_fk: newTask.id,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return newTask;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función para actualizar una tarea
const updateTaskService = async (
  userId: number,
  taskId: number,
  taskData: Task,
  fileProps: any
) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, description, status, due_date } = taskData;

    const { fileUrl, fileId, fileType } = fileProps;

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
      throw new Error('No tiene permisos para actualizar una tarea');
    }

    const updatedTask = await Task.update(
      { title, description, status, due_date },
      { where: { id: taskId }, transaction }
    );

    console.log(updatedTask);

    if (fileProps) {
      await FileTask.update(
        {
          file_type: fileType,
          file_id: fileId,
          file_url: fileUrl,
        },
        { where: { tasks_fk: taskId }, transaction }
      );
    }

    await transaction.commit();

    return { msg: 'Tarea actualizada correctamente' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función para eliminar una tarea
const deleteTaskService = async (
  taskId: number,
  classId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const userClass = await UserClass.findOne({
      where: { users_fk: userId, classes_fk: classId },
      transaction,
    });

    if (!userClass) {
      throw new Error('No perteneces a esta clase');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: foundUser.roles_fk, permissions_fk: 4 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para actualizar una tarea');
    }

    const task = await Task.findOne({ where: { id: taskId }, transaction });

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    const file = await FileTask.findOne({
      where: { tasks_fk: taskId },
      transaction,
    });

    let public_id = null;

    if (file) {
      public_id = file.file_id;
      await FileTask.destroy({ where: { tasks_fk: taskId }, transaction });
    }

    await Task.destroy({ where: { id: taskId }, transaction });

    if (public_id) {
      await deleteFromCloudinary(public_id, (e) => {
        if (e) {
          throw new Error('Error al eliminar la imagen');
        }
        throw new MessageEvent('Imagen eliminada correctamente');
      });
    }

    await transaction.commit();

    return public_id;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función para obtener las tareas de una clase
const getTasksByClassService = async (classId: number, userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: foundUser.roles_fk, permissions_fk: 2 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para visualizar una tarea');
    }

    const classData = await UserClass.findOne({
      where: { users_fk: userId, classes_fk: classId },
      transaction,
    });

    if (!classData) {
      throw new Error('No perteneces a esta clase');
    }

    const classCodeMatch = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classCodeMatch) {
      throw new Error('Clase no encontrada');
    }

    const tasks = await Task.findAll({
      where: { classes_fk: classData.classes_fk },
      transaction,
    });

    const files = await FileTask.findAll({
      where: { tasks_fk: tasks.map((task) => task.id) },
      transaction,
    });

    if (!files) {
      return tasks;
    }

    await transaction.commit();

    return tasks.map((task) => {
      const taskFiles = files.filter((file) => file.tasks_fk === task.id);
      return {
        ...task.dataValues,
        files: taskFiles,
      };
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función para obtener una tarea
const getTaskService = async (
  taskId: number,
  classId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const userClass = await UserClass.findOne({
      where: { users_fk: userId, classes_fk: classId },
      transaction,
    });

    if (!userClass) {
      throw new Error('No perteneces a esta clase');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: foundUser.roles_fk, permissions_fk: 2 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para visualizar una tarea');
    }

    const task = await Task.findOne({
      where: { id: taskId },
      transaction,
    });

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    const files = await FileTask.findAll({
      where: { tasks_fk: task.id },
      transaction,
    });

    if (!files) {
      return task;
    }

    await transaction.commit();

    return {
      ...task.dataValues,
      files,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export {
  createTaskService,
  updateTaskService,
  deleteTaskService,
  getTasksByClassService,
  getTaskService,
};
