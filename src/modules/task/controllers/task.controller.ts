import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskService } from '@task/services/task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from '@task/dtos';

export class TaskController {
  private taskService = new TaskService();

  async create(
    request: FastifyRequest<{
      Params: { courseId: string };
      Body: CreateTaskDto;
    }>,
    reply: FastifyReply
  ) {
    const courseId = request.params.courseId;
    const userId = request.user.id;
    const createTaskDto = request.body;

    const task = await this.taskService.create(
      courseId,
      userId,
      createTaskDto,
      (request as any).fileProps
    );

    reply.code(201).send(task);
  }

  async getAllByCourse(
    request: FastifyRequest<{ Params: { courseId: string } }>,
    reply: FastifyReply
  ) {
    const courseId = request.params.courseId; // ✅ Obtén courseId
    const userId = request.user.id;

    const tasks = await this.taskService.getAllByCourse(courseId, userId);

    reply.code(200).send(tasks);
  }

  async getOne(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string };
    }>,
    reply: FastifyReply
  ) {
    const { courseId, taskId } = request.params;
    const userId = (request.user as any)?.id;

    const task = await this.taskService.getOne(taskId, userId);

    reply.code(200).send(task);
  }

  async update(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string };
      Body: UpdateTaskDto;
    }>,
    reply: FastifyReply
  ) {
    const { courseId, taskId } = request.params;
    const userId = request.user.id;
    const updateTaskDto = request.body;

    await this.taskService.update(
      courseId,
      userId,
      taskId,
      updateTaskDto,
      (request as any).fileProps
    );

    reply.code(200).send({ message: 'Task updated successfully' });
  }

  async delete(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string };
    }>,
    reply: FastifyReply
  ) {
    const { courseId, taskId } = request.params;
    const userId = request.user.id;

    await this.taskService.delete(courseId, taskId, userId);

    reply.code(204).send();
  }

}
