import { CourseService } from '../course/course.service';
import { logger } from '../../common/configs/logger.config';
import { Request, Response, NextFunction } from 'express';

export class CourseController {
  private courseService: CourseService = new CourseService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = req.body;
      const userId = req.user?.id;
      const newCourse = await this.courseService.create(courseData, userId);
      res.status(201).json(newCourse);
    } catch (error) {
      next(error);
    }
  }

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const { classCode } = req.body;
      const userId = req.user?.id;
      const courseData = await this.courseService.join(classCode, userId);
      res.status(200).json(courseData);
    } catch (error) {
      next(error);
    }
  }

  async leave(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.classId;
      const userId = req.user?.id;
      const courseData = await this.courseService.leave(courseId, userId);
      res.status(200).json(courseData);
    } catch (error) {
      next(error);
    }
  }

  async getClassesByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const courses = await this.courseService.getCoursesByUser(userId);
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getUsersByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.classId;
      const users = await this.courseService.getUsersByCourse(courseId);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = req.body;
      const courseId = req.params.classId;
      const userId = req.user?.id;
      const updatedCourse = await this.courseService.update(
        courseId,
        courseData,
        userId
      );
      res.status(200).json(updatedCourse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.classId;
      const userId = req.user?.id;
      await this.courseService.delete(courseId, userId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
