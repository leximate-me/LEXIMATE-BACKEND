import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskService } from '@task/services/task.service';
import {
  CreateTaskDto,
  CreateTaskSubmissionDto,
  UpdateTaskDto,
  UpdateTaskSubmissionDto,
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

  async createSubmission(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string };
      Body: CreateTaskSubmissionDto;
    }>,
    reply: FastifyReply
  ) {
    const { courseId, taskId } = request.params;
    const userId = (request.user as any)?.id;
    const submissionDto = request.body;

    const submission = await this.taskService.createSubmission(
      courseId,
      taskId,
      userId,
      submissionDto,
      (request as any).fileProps
    );

    reply.code(201).send(submission);
  }

  async getSubmissionsByTask(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string };
    }>,
    reply: FastifyReply
  ) {
    const { taskId } = request.params;

    const submissions = await this.taskService.getSubmissionsByTask(taskId);

    reply.code(200).send(submissions);
  }

  async getSubmissionByTask(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string; submissionId: string };
    }>,
    reply: FastifyReply
  ) {
    const { taskId, submissionId } = request.params;

    const submission = await this.taskService.getSubmissionByTask(
      taskId,
      submissionId
    );
    reply.code(200).send(submission);
  }

  async updateSubmission(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string; submissionId: string };
      Body: UpdateTaskSubmissionDto;
    }>,
    reply: FastifyReply
  ) {
    const { taskId, submissionId } = request.params;
    const userId = (request.user as any)?.id;
    const updateDto = request.body;

    const updated = await this.taskService.updateSubmission(
      taskId,
      submissionId,
      userId,
      updateDto
    );

    reply.code(200).send(updated);
  }

  async deleteSubmission(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string; submissionId: string };
    }>,
    reply: FastifyReply
  ) {
    const { taskId, submissionId } = request.params;
    const userId = (request.user as any)?.id;

    const result = await this.taskService.deleteSubmission(
      taskId,
      submissionId,
      userId
    );

    reply.code(200).send(result);
  }

  async qualifySubmission(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string; studentId: string };
      Body: UpdateTaskSubmissionDto;
    }>,
    reply: FastifyReply
  ) {
    const { taskId, studentId } = request.params;
    const updateDto = request.body;

    const submission = await this.taskService.qualifySubmission(
      taskId,
      studentId,
      updateDto
    );

    reply.code(200).send(submission);
  }
}
