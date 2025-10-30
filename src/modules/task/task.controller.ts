import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

export class TaskController {
  private taskService: TaskService = new TaskService();

  async create(
    request: FastifyRequest<{
      Body: CreateTaskDto;
      Params: { courseId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const courseId = request.params.courseId;
      const taskData = request.body;
      const userId = (request.user as any)?.id;
      const fileProps = (request as any).fileProps || null;

      const newTask = await this.taskService.create(
        courseId,
        userId,
        taskData,
        fileProps
      );

      reply.code(201).send(newTask);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Body: UpdateTaskDto;
      Params: { taskId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any)?.id;
      const taskId = request.params.taskId;
      const taskData = request.body;
      const fileProps = (request as any).fileProps || null;

      const updatedTask = await this.taskService.update(
        userId,
        taskId,
        taskData,
        fileProps
      );

      reply.code(200).send(updatedTask);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { taskId: string; courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const taskId = request.params.taskId;
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      await this.taskService.delete(taskId, courseId, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async getAllByCourse(
    request: FastifyRequest<{ Params: { courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      const tasks = await this.taskService.getAllByCourse(courseId, userId);

      reply.code(200).send(tasks);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async getOne(
    request: FastifyRequest<{ Params: { taskId: string; courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const taskId = request.params.taskId;
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      const task = await this.taskService.getOne(taskId, courseId, userId);

      reply.code(200).send(task);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }
}
