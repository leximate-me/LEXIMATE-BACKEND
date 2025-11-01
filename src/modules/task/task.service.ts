import { AppDataSource } from '../../database/db';
import { In } from 'typeorm';
import { User } from '../user/entities';
import { Course } from '../course/entities/course.entity';
import { Task } from './entities/task.entity';
import { TaskFile } from './entities/task-file.entity';
import { HttpError } from '../../common/libs/http-error';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { FileProps } from '../../common/interfaces/file-props';
import { TaskSubmission } from './entities/task-submission.entity';
import { SubmissionFile } from './entities/submission-file.entity';
import { CreateTaskSubmissionDto } from './dtos/create-task-submission.dto';
import { UpdateTaskSubmissionDto } from './dtos/update-task-submission.dto';

export class TaskService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly taskRepository = AppDataSource.getRepository(Task);
  private readonly fileTaskRepository = AppDataSource.getRepository(TaskFile);
  private readonly submissionRepository =
    AppDataSource.getRepository(TaskSubmission);
  private readonly submissionFileRepository =
    AppDataSource.getRepository(SubmissionFile);

  async create(
    courseId: string,
    userId: string,
    createTaskDto: CreateTaskDto,
    fileProps?: FileProps
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
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
      return newTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    fileProps?: FileProps
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw HttpError.notFound('User not found');

      const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['course'],
      });
      if (!task) throw HttpError.notFound('Task not found');

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
      return { message: 'Task updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(taskId: string, courseId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
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

      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) throw HttpError.notFound('Task not found');

      const file = await this.fileTaskRepository.findOne({
        where: { task: { id: taskId } },
      });

      let public_id = null;
      if (file) {
        public_id = file.file_id;
        await this.fileTaskRepository.delete({ id: file.id });
      }

      await this.taskRepository.delete({ id: taskId });

      // if (public_id) {
      //   try {
      //     await deleteFromCloudinary(public_id);
      //   } catch (e) {
      //     throw HttpError.internalServerError('Error al eliminar la imagen');
      //   }
      // }

      await queryRunner.commitTransaction();
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
    });

    const files = await this.fileTaskRepository.find({
      where: tasks.length
        ? { task: { id: In(tasks.map((task) => task.id)) } }
        : {},
    });

    return tasks.map((task) => {
      const taskFiles = files.filter((file) => file.task.id === task.id);
      return {
        ...task,
        files: taskFiles,
      };
    });
  }

  async getOne(taskId: string, courseId: string, userId: string) {
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

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) throw HttpError.notFound('Task not found');

    const files = await this.fileTaskRepository.find({
      where: { task: { id: taskId } },
    });

    return {
      ...task,
      files,
    };
  }

  async createSubmission(
    taskId: string,
    userId: string,
    submissionDto: CreateTaskSubmissionDto,
    fileProps?: any
  ) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw HttpError.notFound('Task not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw HttpError.notFound('User not found');

    const submission = this.submissionRepository.create({
      task,
      user,
      comment: submissionDto.comment,
      status: submissionDto.status,
      qualification: submissionDto.qualification,
    });

    await this.submissionRepository.save(submission);

    // Si hay archivos, los guarda
    if (fileProps) {
      const { fileUrl, fileId, fileType } = fileProps;
      const submissionFile = this.submissionFileRepository.create({
        file_url: fileUrl,
        file_id: fileId,
        file_type: fileType,
        submission,
      });
      await this.submissionFileRepository.save(submissionFile);
    }

    return submission;
  }

  async getSubmissionsByTask(taskId: string) {
    return this.submissionRepository.find({
      where: { task: { id: taskId } },
      relations: ['user', 'files'],
    });
  }

  async updateSubmission(
    submissionId: string,
    userId: string,
    updateDto: UpdateTaskSubmissionDto
  ) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['user'],
    });
    if (!submission) throw HttpError.notFound('Submission not found');

    // Solo el dueño puede actualizar
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

  async deleteSubmission(submissionId: string, userId: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['user'],
    });
    if (!submission) throw HttpError.notFound('Submission not found');

    // Solo el dueño puede eliminar
    if (submission.user.id !== userId) {
      throw HttpError.forbidden(
        'You do not have permission to delete this submission'
      );
    }

    await this.submissionRepository.delete({ id: submissionId });
    return { message: 'Delivery successfully deleted' };
  }
}
