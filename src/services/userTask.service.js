import { UsersClasses } from '../models/userClass.model.js';
import { Class } from '../models/class.model.js';
import { Task } from '../models/task.model.js';
import { FileTask } from '../models/fileTask.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { sequelize } from '../database/db.js';
import { json } from 'sequelize';

// Funcion para crear una tarea
const createTaskService = async (classId, taskData, user) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      title,
      description,
      status,
      due_date,
      imageUrl,
      imageId,
      imageProps,
    } = taskData;
    if (!title || !status) {
      throw new Error('Faltan datos');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 1 },
      },
      { transaction }
    );

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para crear una tarea');
    }

    const classCodeMatch = await Class.findOne(
      {
        where: { id: classId },
      },
      { transaction }
    );

    if (!classCodeMatch) {
      throw new Error('Clase no encontrada');
    }

    const classData = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: classCodeMatch.id },
      },
      { transaction }
    );

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

// Funcion para actualizar una tarea
const updateTaskService = async (taskId, taskData, user) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      title,
      description,
      status,
      due_date,
      imageUrl,
      imageId,
      imageProps,
    } = taskData;
    if (!title || !status) {
      throw new Error('Faltan datos');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.id, permissions_fk: 3 },
      },
      { transaction }
    );

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para actualizar una tarea');
    }

    const updatedTask = await Task.update(
      { title, description, status, due_date },
      { where: { id: taskId } },
      { transaction }
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
        { where: { tasks_fk: taskId } },
        { transaction }
      );
    }

    await transaction.commit();

    return { msg: 'Tarea actualizada correctamente' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Funcion para eliminar una tarea
const deleteTaskService = async (taskId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!taskId) {
      throw new Error('Id de tarea no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.id, permissions_fk: 4 },
      },
      { transaction }
    );

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para actualizar una tarea');
    }

    const task = await Task.findOne({ where: { id: taskId } }, { transaction });

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    const file = await FileTask.findOne(
      { where: { tasks_fk: taskId } },
      { transaction }
    );

    let public_id = null;

    if (file) {
      public_id = file.file_id;
      await FileTask.destroy({ where: { tasks_fk: taskId } }, { transaction });
    }

    await Task.destroy({ where: { id: taskId } }, { transaction });

    await transaction.commit();

    return public_id;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Funcion para obtener las tareas de una clase
const getTasksByClassService = async (classId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Id de clase no proporcionado');
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne(
      {
        where: { roles_fk: user.rol, permissions_fk: 2 },
      },
      { transaction }
    );

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para visualizar una tarea');
    }

    const classCodeMatch = await Class.findOne(
      {
        where: { id: classId },
      },
      { transaction }
    );

    if (!classCodeMatch) {
      throw new Error('Clase no encontrada');
    }

    const classData = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: classCodeMatch.id },
      },
      { transaction }
    );

    if (!classData) {
      throw new Error('No perteneces a esta clase');
    }

    const tasks = await Task.findAll(
      {
        where: { classes_fk: classData.classes_fk },
      },
      { transaction }
    );

    const files = await FileTask.findAll(
      {
        where: { tasks_fk: tasks.map((task) => task.id) },
      },
      { transaction }
    );

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

// Funcion para obtener una tarea
const getTaskService = async (taskId) => {
  const transaction = await sequelize.transaction();
  try {
    if (!taskId) {
      throw new Error('Id de tarea no proporcionado');
    }

    const task = await Task.findOne(
      {
        where: { id: taskId },
      },
      { transaction }
    );

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    const files = await FileTask.findAll(
      {
        where: { tasks_fk: task.id },
      },
      { transaction }
    );

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
