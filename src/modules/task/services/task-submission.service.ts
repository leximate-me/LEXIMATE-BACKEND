import { AppDataSource } from '@database/db';
import { HttpError } from '@common/libs/http-error';
import { TaskStatus } from '@common/enums/task-status.enum';

import { Course } from '@course/entities/course.entity';
import { User } from '@user/entities';
import { Task, SubmissionFile, TaskSubmission } from '@task/entities';

import {
  CreateTaskSubmissionDto,
  UpdateTaskSubmissionDto,
} from '@task/dtos';

import { notificationEmitter } from '@common/events/notification.events';
import { NotificationEnum } from '@common/enums/notification.enum';
import { taskEventEmitter } from '@common/events/task.events';

export class TaskSubmissionService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly taskRepository = AppDataSource.getRepository(Task);
  private readonly submissionRepository =
    AppDataSource.getRepository(TaskSubmission);
  private readonly submissionFileRepository =
    AppDataSource.getRepository(SubmissionFile);
  private dataSource = AppDataSource.getDataSource();

  async createSubmission(
    courseId: string,
    taskId: string,
    userId: string,
    submissionDto: CreateTaskSubmissionDto,
    fileProps?: any
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw HttpError.notFound('User not found');

      const course = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['users'],
      });
      if (!course) throw HttpError.notFound('Course not found');

      const task = await this.taskRepository.findOne({
        where: { id: taskId, course: { id: courseId } },
        relations: ['course'],
      });
      if (!task) {
        throw HttpError.notFound('Task not found in this course');
      }

      const existingSubmission = await this.submissionRepository.findOne({
        where: { task: { id: taskId }, user: { id: userId } },
      });

      if (existingSubmission) {
        throw HttpError.conflict('Submission already exists for this task');
      }

      const submission = this.submissionRepository.create({
        task,
        user,
        comment: submissionDto.comment,
        status: TaskStatus.SUBMITTED,
        qualification: null,
      });

      await queryRunner.manager.save(submission);

      if (fileProps) {
        const { fileUrl, fileId, fileType } = fileProps;
        const submissionFile = this.submissionFileRepository.create({
          file_url: fileUrl,
          file_id: fileId,
          file_type: fileType,
          submission,
        });
        await queryRunner.manager.save(submissionFile);
      }

      await queryRunner.commitTransaction();

      // Notify teacher about new submission
      const teacher = course.users.find(u => u.role?.name === 'teacher');
      if (teacher) {
        notificationEmitter.emit('create_notification', {
          userId: teacher.id,
          type: NotificationEnum.TASK_SUBMITTED,
          title: 'Nueva entrega de tarea',
          message: `${user.user_name} ha enviado la tarea: ${task.title}`,
          data: {
            url: `/courses/${courseId}/task/${task.id}`,
            taskId: task.id,
            courseId: courseId,
            submissionId: submission.id,
            studentId: user.id,
            studentName: user.user_name,
          },
        });
      }

      // Emit real-time event for WebSocket broadcast
      taskEventEmitter.emit('task_submitted', {
        submission: {
          id: submission.id,
          taskId: task.id,
          taskTitle: task.title,
          studentId: user.id,
          studentName: user.user_name,
          comment: submission.comment,
          status: submission.status,
        },
        userIds: course.users.map((u) => u.id),
      });

      return submission;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async qualifySubmission(
    taskId: string,
    studentId: string,
    updateDto: UpdateTaskSubmissionDto
  ) {
    if (!taskId) throw HttpError.badRequest('Task ID is required');
    if (!studentId) throw HttpError.badRequest('Student ID is required');

    let submission = await this.submissionRepository.findOne({
      where: { task: { id: taskId }, user: { id: studentId } },
      relations: ['task', 'user', 'submissionFiles'],
    });

    if (!submission) {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) throw HttpError.notFound('Task not found');

      const user = await this.userRepository.findOne({
        where: { id: studentId },
      });
      if (!user) throw HttpError.notFound('User not found');

      submission = this.submissionRepository.create({
        task,
        user,
        comment: updateDto.comment ?? '',
        status: updateDto.status ?? TaskStatus.NOT_SUBMITTED,
        qualification: updateDto.qualification,
      });
      await this.submissionRepository.save(submission);
    } else {
      if (updateDto.qualification !== undefined) {
        submission.qualification = updateDto.qualification;
      }
      if (updateDto.comment !== undefined) {
        submission.comment = updateDto.comment;
      }
      if (updateDto.status !== undefined) {
        submission.status = updateDto.status;
      }
      await this.submissionRepository.save(submission);
    }

    const updatedSubmission = await this.submissionRepository.findOne({
      where: { id: submission.id },
      relations: ['task', 'user', 'submissionFiles', 'task.course', 'task.course.users'],
    });

    // Emit real-time event for WebSocket broadcast
    if (updatedSubmission) {
      taskEventEmitter.emit('submission_qualified', {
        submission: {
          id: updatedSubmission.id,
          taskId: updatedSubmission.task.id,
          taskTitle: updatedSubmission.task.title,
          studentId: updatedSubmission.user.id,
          studentName: updatedSubmission.user.user_name,
          qualification: updatedSubmission.qualification,
          status: updatedSubmission.status,
          comment: updatedSubmission.comment,
        },
        userIds: updatedSubmission.task.course.users.map((u) => u.id),
      });
    }

    return updatedSubmission;
  }

  async getSubmissionsByTask(taskId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw HttpError.notFound('Task not found');

    return this.submissionRepository.find({
      where: { task: { id: taskId } },
      relations: ['user', 'submissionFiles'],
    });
  }

  async getSubmissionByTask(taskId: string, submissionId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw HttpError.notFound('Task not found');
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId, task: { id: taskId } },
      relations: ['user', 'submissionFiles'],
    });
    if (!submission) throw HttpError.notFound('Submission not found');
    return submission;
  }

  async updateSubmission(
    taskId: string,
    submissionId: string,
    userId: string,
    updateDto: UpdateTaskSubmissionDto
  ) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId, task: { id: taskId } },
      relations: ['user', 'task', 'task.course', 'task.course.users'],
    });
    if (!submission) throw HttpError.notFound('Submission not found');

    if (submission.user.id !== userId) {
      throw HttpError.forbidden(
        'You do not have permission to update this submission'
      );
    }

    if (updateDto.comment !== undefined) submission.comment = updateDto.comment;
    if (updateDto.status !== undefined) submission.status = updateDto.status;
    if (updateDto.qualification !== undefined)
      submission.qualification = updateDto.qualification;

    await this.submissionRepository.save(submission);

    // Emit real-time event for WebSocket broadcast
    taskEventEmitter.emit('submission_updated', {
      submission: {
        id: submission.id,
        taskId: submission.task.id,
        taskTitle: submission.task.title,
        studentId: submission.user.id,
        studentName: submission.user.user_name,
        comment: submission.comment,
        status: submission.status,
        qualification: submission.qualification,
      },
      userIds: submission.task.course.users.map((u) => u.id),
    });

    return submission;
  }

  async deleteSubmission(taskId: string, submissionId: string, userId: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId, task: { id: taskId } },
      relations: ['user', 'task', 'task.course', 'task.course.users'],
    });
    if (!submission) throw HttpError.notFound('Submission not found');

    if (submission.user.id !== userId) {
      throw HttpError.forbidden(
        'You do not have permission to delete this submission'
      );
    }

    const userIds = submission.task.course.users.map((u) => u.id);

    await this.submissionRepository.delete({ id: submissionId });

    // Emit real-time event for WebSocket broadcast
    taskEventEmitter.emit('submission_deleted', {
      submissionId,
      taskId,
      userIds,
    });

    return { message: 'Submission successfully deleted' };
  }
}
