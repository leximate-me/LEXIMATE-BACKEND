import { FastifyRequest, FastifyReply } from 'fastify';
import { CourseService } from '../course/course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

export class CourseController {
  private courseService: CourseService = new CourseService();

  async create(
    request: FastifyRequest<{ Body: CreateCourseDto }>,
    reply: FastifyReply
  ) {
    try {
      const courseData = request.body;
      const userId = request.user?.id;

      const newCourse = await this.courseService.create(courseData, userId);

      reply.code(201).send(newCourse);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async join(
    request: FastifyRequest<{ Body: { classCode: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { classCode } = request.body;
      const userId = (request.user as any)?.id;
      const courseData = await this.courseService.join(classCode, userId);
      reply.code(200).send(courseData);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async leave(
    request: FastifyRequest<{ Params: { courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;
      const courseData = await this.courseService.leave(courseId, userId);
      reply.code(200).send(courseData);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async getClassesByUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      const courses = await this.courseService.getCoursesByUser(userId);
      reply.code(200).send(courses);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async getUsersByClass(
    request: FastifyRequest<{ Params: { courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const courseId = request.params.courseId;
      const users = await this.courseService.getUsersByCourse(courseId);
      reply.code(200).send(users);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Body: UpdateCourseDto;
      Params: { courseId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const courseData = request.body;
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;
      const updatedCourse = await this.courseService.update(
        courseId,
        courseData,
        userId
      );
      reply.code(200).send(updatedCourse);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;
      await this.courseService.delete(courseId, userId);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }
}
