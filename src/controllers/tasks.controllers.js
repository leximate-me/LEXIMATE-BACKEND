import { taskModel } from '../models/task.model.js';

const createTask = async (req, res) => {
  const { title, description, date, completed } = req.body;
  try {
    const newTask = new taskModel({
      title,
      description,
      date,
      completed,
      user: req.user.id,
    });
    if (!title || !description) {
      res.status(400).json({ error: ['Título y descripción son requeridos'] });
    }
    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({ user: req.user.id }).populate('user');
    if (!tasks) {
      return res.status(404).json({ error: ['No hay tareas para mostrar'] });
    }
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: ['Tarea no encontrada'] });
    }
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, description, date, completed } = req.body;
  try {
    const updateTask = await taskModel.findByIdAndUpdate(
      id,
      { title, description, date, completed },
      { new: true }
    );
    if (!updateTask) {
      return res.status(404).json({ error: ['Tarea no encontrada'] });
    }
    return res.status(200).json(updateTask);
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const taskDeleted = await taskModel.findByIdAndDelete(id);
    if (!taskDeleted) {
      return res.status(404).json({ error: ['Tarea no encontrada'] });
    }
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { createTask, getTasks, getTask, updateTask, deleteTask };
