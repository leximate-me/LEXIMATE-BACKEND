import { taskModel } from '../models/task.model.js';
import { classModel } from '../models/class.model.js';

const createTask = async (req, res) => {
  const { classId } = req.params;
  const { title, description, dueDate } = req.body;

  try {
    const classFound = await classModel.findById(classId);
    if (!classFound) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    const newTask = new taskModel({
      title,
      description,
      dueDate,
      class: classId,
      createdBy: req.user.id, // Se asume que el usuario está autenticado (profesor)
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task: savedTask,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor al crear la tarea' });
  }
};

const getTasksByClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const tasks = await taskModel.find({ class: classId });
    if (!tasks) {
      return res
        .status(404)
        .json({ error: 'No se encontraron tareas para esta clase' });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor al obtener las tareas' });
  }
};

const updateTask = async (req, res) => {
  const { classId, taskId } = req.params;
  const { title, description, dueDate, status } = req.body;

  try {
    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, class: classId },
      { title, description, dueDate, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json({
      message: 'Tarea actualizada exitosamente',
      task,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor al actualizar la tarea' });
  }
};

const deleteTask = async (req, res) => {
  const { classId, taskId } = req.params;

  try {
    const task = await taskModel.findOneAndDelete({
      _id: taskId,
      class: classId,
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json({
      message: 'Tarea eliminada exitosamente',
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor al eliminar la tarea' });
  }
};

export { createTask, getTasksByClass, updateTask, deleteTask };
