import { In } from 'typeorm';
import { AppDataSource } from '@database/db';
import { HttpError } from '@common/libs/http-error';
import { FileProps } from '@common/interfaces/file-props';
import { TaskStatus } from '@common/enums/task-status';

import { Course } from '@course/entities/course.entity';
import { User } from '@user/entities';
import { Task, SubmissionFile, TaskFile, TaskSubmission } from '@task/entities';

import { CreateTaskDto } from '@task/dtos/create-task.dto';
import { UpdateTaskDto } from '@task/dtos/update-task.dto';
import { CreateTaskSubmissionDto } from '@task/dtos/create-task-submission.dto';
import { UpdateTaskSubmissionDto } from '@task/dtos/update-task-submission.dto';
import { NotificationService } from '@modules/notification/notification.service';

export class TaskService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly taskRepository = AppDataSource.getRepository(Task);
  private readonly fileTaskRepository = AppDataSource.getRepository(TaskFile);
  private readonly submissionRepository =
    AppDataSource.getRepository(TaskSubmission);
  private readonly submissionFileRepository =
    AppDataSource.getRepository(SubmissionFile);
  private dataSource = AppDataSource.getDataSource();
  private notificationService = new NotificationService();

  async create(
    courseId: string,
    userId: string,
    createTaskDto: CreateTaskDto,
    fileProps?: FileProps
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role', 'courses'],
      });

      if (!foundUser) throw HttpError.notFound('User not found');

      const courseData = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['users'],
      });
      if (!courseData) throw HttpError.notFound('Course not found');

      const isInCourse = courseData.users.some((u) => u.id === userId);
      if (!isInCourse)
        throw HttpError.forbidden('The user does not belong to the class');

      const newTask = this.taskRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        due_date: createTaskDto.due_date,
        course: courseData,
      });
      await queryRunner.manager.save(newTask);

      if (fileProps) {
        const { fileUrl, fileId, fileType } = fileProps;
        const newFileTask = this.fileTaskRepository.create({
          file_type: fileType,
          file_id: fileId,
          file_url: fileUrl,
          task: newTask,
        });
        await queryRunner.manager.save(newFileTask);
      }

      await queryRunner.commitTransaction();

      // Notify students
      const studentIds = courseData.users
        .filter((user) => user.role?.name === 'student')
        .map((user) => user.id);

      if (studentIds.length > 0) {
        for (const studentId of studentIds) {
          await this.notificationService.createNotification(
            studentId,
            'task',
            `New task: ${newTask.title}`,
            `A new task has been created in the course ${courseData.name}`,
            {
              taskId: newTask.id,
              courseId: courseData.id,
              title: newTask.title,
              dueDate: newTask.due_date,
            }
          );
        }
      }

      // Notify teacher
      await this.notificationService.createNotification(
        userId,
        'task',
        `Task created: ${newTask.title}`,
        `You have created the task "${newTask.title}" in the course ${courseData.name}`,
        {
          taskId: newTask.id,
          courseId: courseData.id,
          title: newTask.title,
          dueDate: newTask.due_date,
        }
      );

      return newTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    courseId: string,
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    fileProps?: FileProps
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw HttpError.notFound('User not found');

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

      if (updateTaskDto.title) task.title = updateTaskDto.title;
      if (updateTaskDto.description)
        task.description = updateTaskDto.description;
      if (updateTaskDto.due_date)
        task.due_date = new Date(updateTaskDto.due_date);

      await queryRunner.manager.save(task);

      if (fileProps) {
        const { fileUrl, fileId, fileType } = fileProps;
        let fileTask = await this.fileTaskRepository.findOne({
          where: { task: { id: taskId } },
        });
        if (fileTask) {
          fileTask.file_url = fileUrl;
          fileTask.file_id = fileId;
          fileTask.file_type = fileType;
          await queryRunner.manager.save(fileTask);
        } else {
          fileTask = this.fileTaskRepository.create({
            file_url: fileUrl,
            file_id: fileId,
            file_type: fileType,
            task: task,
          });
          await queryRunner.manager.save(fileTask);
        }
      }

      await queryRunner.commitTransaction();

      // Notify students about changes
      const studentIds = course.users
        .filter((user) => user.role?.name === 'student')
        .map((user) => user.id);

      if (studentIds.length > 0) {
        for (const studentId of studentIds) {
          await this.notificationService.createNotification(
            studentId,
            'task',
            `Task updated: ${task.title}`,
            `The task "${task.title}" has been updated`,
            {
              taskId: task.id,
              courseId: course.id,
              title: task.title,
            }
          );
        }
      }

      return { message: 'Task updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(courseId: string, taskId: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw HttpError.notFound('User not found');

      const course = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['users'],
      });
      if (!course) throw HttpError.notFound('Course not found');

      const task = await this.taskRepository.findOne({
        where: { id: taskId, course: { id: courseId } },
        relations: ['taskFiles'],
      });
      if (!task) {
        throw HttpError.notFound('Task not found in this course');
      }

      let public_id = null;

      if (task.taskFiles && task.taskFiles.length > 0) {
        public_id = task.taskFiles[0].file_id;
      }

      await queryRunner.manager.remove(task);
      await queryRunner.commitTransaction();

      // Notify students about deletion
      const studentIds = course.users
        .filter((user) => user.role?.name === 'student')
        .map((user) => user.id);

      if (studentIds.length > 0) {
        for (const studentId of studentIds) {
          await this.notificationService.createNotification(
            studentId,
            'task',
            `Task deleted: ${task.title}`,
            `The task "${task.title}" has been deleted`,
            {
              taskId: task.id,
              courseId: course.id,
              title: task.title,
            }
          );
        }
      }

      return public_id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllByCourse(courseId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!courseData) throw HttpError.notFound('Course not found');

    const isInCourse = courseData.users.some((u) => u.id === userId);
    if (!isInCourse)
      throw HttpError.forbidden('The user does not belong to the class');

    const tasks = await this.taskRepository.find({
      where: { course: { id: courseId } },
      relations: ['taskFiles'],
    });

    return tasks;
  }

  async getOne(taskId: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['course'],
    });
    if (!task) throw HttpError.notFound('Task not found');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!user) throw HttpError.notFound('User not found');

    const isInCourse = user.courses.some((c) => c.id === task.course.id);
    if (!isInCourse)
      throw HttpError.forbidden('The user does not belong to the class');

    const files = await this.fileTaskRepository.find({
      where: { task: { id: taskId } },
    });

    return {
      ...task,
      files,
    };
  }

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

      // Notify teachers
      const teacherIds = course.users
        .filter((u) => u.role?.name === 'teacher')
        .map((u) => u.id);

      for (const teacherId of teacherIds) {
        await this.notificationService.createNotification(
          teacherId,
          'submission',
          `New submission for ${task.title}`,
          `A student has submitted the task "${task.title}"`,
          {
            submissionId: submission.id,
            taskId: task.id,
            courseId: course.id,
            userId,
            taskTitle: task.title,
          }
        );
      }

      // Notify student
      await this.notificationService.createNotification(
        userId,
        'submission',
        `Submission registered: ${task.title}`,
        `Your submission for the task "${task.title}" has been registered`,
        {
          submissionId: submission.id,
          taskId: task.id,
          taskTitle: task.title,
        }
      );

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
      relations: ['task', 'user', 'submissionFiles'],
    });

    // Notify student about grade
    if (updateDto.qualification !== undefined) {
      await this.notificationService.createNotification(
        studentId,
        'grade',
        `Grade received: ${submission.task.title}`,
        `Your task has been graded with ${updateDto.qualification}${
          updateDto.comment ? ' - ' + updateDto.comment : ''
        }`,
        {
          submissionId: submission.id,
          taskId: submission.task.id,
          grade: updateDto.qualification,
          taskTitle: submission.task.title,
        }
      );
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
      relations: ['user', 'task'],
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
    return submission;
  }

  async deleteSubmission(taskId: string, submissionId: string, userId: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId, task: { id: taskId } },
      relations: ['user', 'task'],
    });
    if (!submission) throw HttpError.notFound('Submission not found');

    if (submission.user.id !== userId) {
      throw HttpError.forbidden(
        'You do not have permission to delete this submission'
      );
    }

    await this.submissionRepository.delete({ id: submissionId });
    return { message: 'Submission successfully deleted' };
  }
}
