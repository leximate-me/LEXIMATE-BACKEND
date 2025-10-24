import { CourseService } from '../course/course.service';
import { logger } from '../../common/configs/logger.config';

import { Request, Response } from 'express';

export class CourseController {
  private courseService: CourseService = new CourseService();

  async create(req: Request, res: Response): Promise<void> {
    try {
      const classData = req.body;
      if (!classData) {
        res.status(400).json({ error: ['Falta la información de la clase'] });
        return;
      }
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: ['Usuario no autenticado'] });
        return;
      }
      const newClass = await this.courseService.create(classData, userId);
      res.status(201).json(newClass);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en createClassController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en createClassController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }

  async join(req: Request, res: Response): Promise<void> {
    try {
      const { classCode } = req.body;
      if (!classCode) {
        res.status(400).json({ error: ['Falta el código de la clase'] });
        return;
      }
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: ['Usuario no autenticado'] });
        return;
      }
      const classData = await this.courseService.join(classCode, userId);
      if (!classData) {
        res.status(404).json({ error: ['Clase no encontrada'] });
        return;
      }
      res.status(200).json(classData);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en joinClassController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en joinClassController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }

  async leave(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId;
      if (!classId) {
        res.status(400).json({ error: ['Falta el id de la clase'] });
        return;
      }
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: ['Usuario no autenticado'] });
        return;
      }
      const classData = await this.courseService.leave(classId, userId);
      if (!classData) {
        res.status(404).json({ error: ['Clase no encontrada'] });
        return;
      }
      res.status(200).json(classData);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en leaveClassController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en leaveClassController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }

  async getClassesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: ['Usuario no autenticado'] });
        return;
      }
      const classes = await this.courseService.getCoursesByUser(userId);
      if (!classes) {
        res.status(404).json({ error: ['Clases no encontradas'] });
        return;
      }
      res.status(200).json(classes);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en getClassesByUserController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en getClassesByUserController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }

  async getUsersByClass(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId;
      if (!classId) {
        res.status(400).json({ error: ['Falta el id de la clase'] });
        return;
      }
      const users = await this.courseService.getUsersByCourses(classId);
      if (!users) {
        res.status(404).json({ error: ['Usuarios no encontrados'] });
        return;
      }
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en getUsersByClassController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en getUsersByClassController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const classData = req.body;
      if (!classData) {
        res.status(400).json({ error: ['Falta la información de la clase'] });
        return;
      }
      const classId = req.params.classId;
      if (!classId) {
        res.status(400).json({ error: ['Falta el id de la clase'] });
        return;
      }
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: ['Usuario no autenticado'] });
        return;
      }
      const updatedClass = await this.courseService.update(
        classId,
        classData,
        userId
      );
      if (!updatedClass) {
        res.status(404).json({ error: ['Clase no encontrada'] });
        return;
      }
      res.status(200).json(updatedClass);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en updateClassController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en updateClassController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId;
      if (!classId) {
        res.status(400).json({ error: ['Falta el id de la clase'] });
        return;
      }
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: ['Usuario no autenticado'] });
        return;
      }
      const deleteClass = await this.courseService.delete(classId, userId);
      if (!deleteClass) {
        res.status(404).json({ error: ['Clase no encontrada'] });
        return;
      }
      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en deleteClassController');
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en deleteClassController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }
}
