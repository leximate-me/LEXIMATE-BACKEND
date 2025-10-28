import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { logger } from '../../common/configs/logger.config';

export class TaskController {
  private taskService: TaskService = new TaskService();

  async create(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId;
      const taskData = req.body;
      const userId = req.user?.id;

      if (!classId || !taskData || !userId) {
        res.status(400).json({ error: 'Datos insuficientes' });
        return;
      }

      let fileUrl, fileId, fileType;
      if (req.file) {
        fileUrl = req.file.cloudinaryUrl;
        fileId = req.file.cloudinaryPublicId;
        fileType = req.file.mimetype;
      }

      const fileProps = {
        fileUrl: fileUrl || '',
        fileId: fileId || '',
        fileType: fileType || '',
      };

      const newTask = await this.taskService.create(
        classId,
        userId,
        taskData,
        fileProps
      );

      if (!newTask) {
        res.status(404).json({ error: 'No se pudo crear la tarea' });
        return;
      }

      res.status(201).json(newTask);
    } catch (error) {
      logger.error(error, 'Error en createTaskController');
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const taskId = req.params.taskId;
      const taskData = req.body;

      if (!userId || !taskId || !taskData) {
        res.status(400).json({ error: 'Datos insuficientes' });
        return;
      }

      let fileUrl, fileId, fileType;
      if (req.file && req.file.cloudinaryUrl) {
        fileUrl = req.file.cloudinaryUrl;
        fileId = req.file.cloudinaryPublicId;
        fileType = req.file.mimetype;
      }

      const fileProps = {
        fileUrl: fileUrl || '',
        fileId: fileId || '',
        fileType: fileType || '',
      };

      const updatedTask = await this.taskService.update(
        userId,
        taskId,
        taskData,
        fileProps
      );

      if (!updatedTask) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      logger.error(error, 'Error en updateTaskController');
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!taskId || !classId || !userId) {
        res.status(400).json({ error: 'Datos insuficientes' });
        return;
      }

      const deleted = await this.taskService.delete(taskId, classId, userId);

      if (!deleted) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }

      res.status(204).end();
    } catch (error) {
      logger.error(error, 'Error en deleteTaskController');
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getAllByCourse(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!classId || !userId) {
        res.status(400).json({ error: 'Datos insuficientes' });
        return;
      }

      const tasks = await this.taskService.getAllByCourse(classId, userId);

      if (!tasks) {
        res.status(404).json({ error: 'No se encontraron tareas' });
        return;
      }

      res.status(200).json(tasks);
    } catch (error) {
      logger.error(error, 'Error en getTasksByClassController');
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!taskId || !classId || !userId) {
        res.status(400).json({ error: 'Datos insuficientes' });
        return;
      }

      const task = await this.taskService.getOne(taskId, classId, userId);

      if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      logger.error(error, 'Error en getTaskController');
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
