import { logger } from '../configs/logger.config';
import {
  createTaskService,
  updateTaskService,
  deleteTaskService,
  getTasksByClassService,
  getTaskService,
} from '../services/userTask.service';
import { Request, Response } from 'express';

const createTaskController = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.classId);
    const { title, description, status, due_date } = req.body;
    const user = req.user;

    console.log(req.file);

    let imageUrl = undefined;
    let imageId = undefined;
    let imageProps = undefined;

    if (req.file && req.file.cloudinaryUrl) {
      imageUrl = req.file.cloudinaryUrl;
      imageId = req.file.cloudinaryPublicId;
      imageProps = req.file;
    }

    const taskData = {
      title,
      description,
      status,
      due_date,
      imageUrl: imageUrl || '',
      imageId: imageId || '',
      imageProps,
    };

    if (!user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const newTask = await createTaskService(classId, taskData, user);
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en createTaskController');
      res.status(400).json({ error: error.message });
    } else {
      logger.error(error, 'Error desconocido en createTaskController');
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
};

const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { title, description, status, due_date } = req.body;
    const user = req.user;
    const taskId = parseInt(req.params.taskId);

    let imageUrl = undefined;
    let imageProps = undefined;

    if (req.file && req.file.cloudinaryUrl) {
      imageProps = req.file;
      imageUrl = req.file.cloudinaryUrl;
    }

    const taskData = {
      title,
      description,
      status,
      due_date,
      imageUrl: imageUrl || '',
      imageProps,
    };

    if (!user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const updatedTask = await updateTaskService(taskId, taskData, user);
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en updateTaskController');
      res.status(400).json({ error: error.message });
    } else {
      logger.error(error, 'Error desconocido en updateTaskController');
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
};

const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const task = await deleteTaskService(taskId, user);

    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en deleteTaskController');
      res.status(400).json({ error: error.message });
    } else {
      logger.error(error, 'Error desconocido en deleteTaskController');
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
};

const getTasksByClassController = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.classId);
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const tasks = await getTasksByClassService(classId, user);
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en getTasksByClassController');
      res.status(400).json({ error: error.message });
    } else {
      logger.error(error, 'Error desconocido en getTasksByClassController');
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
};

const getTaskController = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const task = await getTaskService(taskId);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en getTaskController');
      res.status(400).json({ error: error.message });
    } else {
      logger.error(error, 'Error desconocido en getTaskController');
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
};

export {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
};
