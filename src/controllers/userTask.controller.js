import fs from 'fs/promises';
import { deleteImage, uploadImage } from '../libs/cloudinary.js';
import { logger } from '../configs/loggerConfig.js';
import {
  createTaskService,
  updateTaskService,
  deleteTaskService,
  getTasksByClassService,
  getTaskService,
} from '../services/userTask.service.js';

const createTaskController = async (req, res) => {
  try {
    const { classCode } = req.params;
    const { title, description, status, due_date } = req.body;
    const user = req.user;

    let imageUrl = null;
    let imageId = null;
    let imageProps = null;
    console.log('hola', req.files);

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      imageProps = req.files.image;
      imageUrl = result.secure_url;
      imageId = result.public_id;
      await fs.unlink(req.files.image.tempFilePath);
    }

    const newTask = await createTaskService(
      classCode,
      { title, description, status, due_date, imageUrl, imageId, imageProps },
      user
    );
    res.status(201).json(newTask);
  } catch (error) {
    logger.error(error, 'Error en createTaskController');
    res.status(400).json({ error: error.message });
  }
};

const updateTaskController = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    const user = req.user;
    const { id } = req.params;

    let imageUrl = null;
    let imageProps = null;

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      imageProps = req.files.image;
      imageUrl = result.secure_url;
      await fs.unlink(req.files.image.tempFilePath);
    }

    const updatedTask = await updateTaskService(
      { id, title, description, status, due_date, imageUrl, imageProps },
      user
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    logger.error(error, 'Error en updateTaskController');
    res.status(400).json({ error: error.message });
  }
};

const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const task = await deleteTaskService(id, user);

    if (task) {
      await deleteImage(task);
    }

    res.status(204).end();
  } catch (error) {
    logger.error(error, 'Error en deleteTaskController');
    res.status(400).json({ error: error.message });
  }
};

const getTasksByClassController = async (req, res) => {
  try {
    const { classCode } = req.params;
    const user = req.user;
    const tasks = await getTasksByClassService(classCode, user);
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(error, 'Error en getTasksByClassController');
    res.status(400).json({ error: error.message });
  }
};

const getTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskService(id);
    res.status(200).json(task);
  } catch (error) {
    logger.error(error, 'Error en getTaskController');
    res.status(400).json({ error: error.message });
  }
};

export {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
};
