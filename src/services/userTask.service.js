import { UsersClasses } from '../models/usersClasses.js';
import { Class } from '../models/class.js';
import { Task } from '../models/task.js';
import { File } from '../models/file.js';
import { RolePermission } from '../models/rolesPermissions.model.js';

// Funcion para crear una tarea
const createTaskService = async (classCode, taskData, user) => {
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

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 1 },
  });
  console.log(verifyPermission);

  if (!verifyPermission) {
    throw new Error('No tiene permisos para crear una tarea');
  }

  const classCodeMatch = await Class.findOne({
    where: { class_code: classCode },
  });

  if (!classCodeMatch) {
    throw new Error('Clase no encontrada');
  }

  const classData = await UsersClasses.findOne({
    where: { users_fk: user.id, classes_fk: classCodeMatch.id },
  });

  if (!classData) {
    throw new Error('No perteneces a esta clase');
  }

  const newTask = await Task.create({
    title,
    description,
    status,
    due_date,
    classes_fk: classData.classes_fk,
  });

  if (imageUrl) {
    await File.create({
      file_name: imageProps.name,
      file_path: imageProps.tempFilePath,
      file_type: imageProps.mimetype,
      file_id: imageId,
      file_url: imageUrl,
      tasks_fk: newTask.id,
    });
  }
  return newTask;
};

// Funcion para actualizar una tarea
const updateTaskService = async (taskData, user) => {
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

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.id, permissions_fk: 3 },
  });

  if (!verifyPermission) {
    throw new Error('No tiene permisos para actualizar una tarea');
  }

  const updatedTask = await Task.update(
    { title, description, status, due_date },
    { where: { id: taskData.id } }
  );

  if (imageUrl) {
    await File.create({
      file_name: imageProps.name,
      file_path: imageProps.tempFilePath,
      file_type: imageProps.mimetype,
      file_id: imageId,
      file_url: imageUrl,
      tasks_fk: taskData.id,
    });
  }
  return updatedTask;
};

// Funcion para eliminar una tarea
const deleteTaskService = async (taskId, user) => {
  if (!taskId) {
    throw new Error('Id de tarea no proporcionado');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.id, permissions_fk: 4 },
  });

  if (!verifyPermission) {
    throw new Error('No tiene permisos para actualizar una tarea');
  }

  const task = await Task.findOne({ where: { id: taskId } });

  if (!task) {
    throw new Error('Tarea no encontrada');
  }

  const file = await File.findOne({ where: { tasks_fk: taskId } });

  let public_id = null;

  if (file) {
    public_id = file.file_id;
    await File.destroy({ where: { tasks_fk: taskId } });
  }

  await Task.destroy({ where: { id: taskId } });

  return public_id;
};

// Funcion para obtener las tareas de una clase
const getTasksByClassService = async (classCode, user) => {
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const verifyPermission = await RolePermission.findOne({
    where: { roles_fk: user.rol, permissions_fk: 2 },
  });

  if (!verifyPermission) {
    throw new Error('No tiene permisos para visualizar una tarea');
  }

  const classCodeMatch = await Class.findOne({
    where: { class_code: classCode },
  });

  if (!classCodeMatch) {
    throw new Error('Clase no encontrada');
  }

  const classData = await UsersClasses.findOne({
    where: { users_fk: user.id, classes_fk: classCodeMatch.id },
  });

  if (!classData) {
    throw new Error('No perteneces a esta clase');
  }

  const tasks = await Task.findAll({
    where: { classes_fk: classData.classes_fk },
  });

  return tasks;
};

// Funcion para obtener una tarea
const getTaskService = async (taskId, user) => {
  if (!taskId) {
    throw new Error('Id de tarea no proporcionado');
  }

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const task = await Task.findOne({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error('Tarea no encontrada');
  }

  return task;
};

export {
  createTaskService,
  updateTaskService,
  deleteTaskService,
  getTasksByClassService,
  getTaskService,
};
