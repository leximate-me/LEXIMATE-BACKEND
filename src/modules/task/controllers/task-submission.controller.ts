import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskSubmissionService } from '../services/task-submission.service';
import {
  CreateTaskSubmissionDto,
  UpdateTaskSubmissionDto,
} from '@task/dtos';
import { PaginationDto } from '@common/dtos/pagination.dto';

export class TaskSubmissionController {
  private submissionService = new TaskSubmissionService();

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

    const submission = await this.submissionService.createSubmission(
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
      Querystring: PaginationDto;
    }>,
    reply: FastifyReply
  ) {
    const { taskId } = request.params;
    const { page = 1, limit = 10 } = request.query;

    const submissions = await this.submissionService.getSubmissionsByTask(taskId, page, limit);

    reply.code(200).send(submissions);
  }

  async getSubmissionByTask(
    request: FastifyRequest<{
      Params: { courseId: string; taskId: string; submissionId: string };
    }>,
    reply: FastifyReply
  ) {
    const { taskId, submissionId } = request.params;

    const submission = await this.submissionService.getSubmissionByTask(
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

    const updated = await this.submissionService.updateSubmission(
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

    const result = await this.submissionService.deleteSubmission(
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

    const submission = await this.submissionService.qualifySubmission(
      taskId,
      studentId,
      updateDto
    );

    reply.code(200).send(submission);
  }
}
