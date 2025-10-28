import { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
export class TaskController {
  private taskService: TaskService = new TaskService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const taskData = req.body;
      const userId = req.user?.id;

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
        courseId,
        userId,
        taskData,
        fileProps
      );

      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const taskId = req.params.taskId;
      const taskData = req.body;

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

      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      const courseId = req.params.courseId;
      const userId = req.user?.id;

      const deleted = await this.taskService.delete(taskId, courseId, userId);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  async getAllByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const userId = req.user?.id;

      const tasks = await this.taskService.getAllByCourse(courseId, userId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      const courseId = req.params.courseId;
      const userId = req.user?.id;

      const task = await this.taskService.getOne(taskId, courseId, userId);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }
}
