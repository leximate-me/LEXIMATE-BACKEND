import { UserClass } from '../models/userClass.model';
import { User } from '../models/user.model';
import { Class } from '../models/class.model';
import { Task } from '../models/task.model';
import { FileTask } from '../models/fileTask.model';
import { RolePermission } from '../models/rolePermission.model';
import { Role } from '../models/role.model';
import { sequelize } from '../database/db';

interface TaskData {
  title: string;
  description: string;
  status: boolean;
  due_date: Date;
  imageUrl?: string;
  imageId?: string;
  imageProps: any;
}

interface UserData {
  id: number;
  rol: number;
  verify: boolean;
}

// Función para crear una tarea
const createTaskService = async (
  classId: number,
  taskData: TaskData,
  user: UserData
) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      title,
      description,
      status,
      due_date,
      imageUrl = '',
      imageId = '',
      imageProps,
    } = taskData;
    if (!title || !status) {
      throw new Error('Faltan datos');
    }

    if (!user) {
      throw new Error('Usuario no proporcionado');
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
      where: { users_fk: user.id, classes_fk: classCodeMatch.id },
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

    if (imageUrl) {
      await FileTask.create(
        {
          file_name: imageProps.name,
          file_path: imageProps.tempFilePath,
          file_type: imageProps.mimetype,
          file_id: imageId,
          file_url: imageUrl,
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
  taskId: number,
  taskData: TaskData,
  user: UserData
) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      title,
      description,
      status,
      due_date,
      imageUrl = '',
      imageId = '',
      imageProps,
    } = taskData;
    if (!title || !status) {
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

    if (imageUrl) {
      await FileTask.update(
        {
          file_name: imageProps.name,
          file_path: imageProps.tempFilePath,
          file_type: imageProps.mimetype,
          file_id: imageId,
          file_url: imageUrl,
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
const deleteTaskService = async (taskId: number, user: UserData) => {
  const transaction = await sequelize.transaction();
  try {
    if (!taskId) {
      throw new Error('Id de tarea no proporcionado');
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

    await transaction.commit();

    return public_id;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función para obtener las tareas de una clase
const getTasksByClassService = async (classId: number, user: UserData) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Id de clase no proporcionado');
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
      where: { roles_fk: foundUser.roles_fk, permissions_fk: 2 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para visualizar una tarea');
    }

    const classCodeMatch = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!classCodeMatch) {
      throw new Error('Clase no encontrada');
    }

    const classData = await UserClass.findOne({
      where: { users_fk: user.id, classes_fk: classCodeMatch.id },
      transaction,
    });

    if (!classData) {
      throw new Error('No perteneces a esta clase');
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
const getTaskService = async (taskId: number) => {
  const transaction = await sequelize.transaction();
  try {
    if (!taskId) {
      throw new Error('Id de tarea no proporcionado');
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
