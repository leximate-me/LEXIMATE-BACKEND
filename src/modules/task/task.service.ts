import { AppDataSource } from '../../database/db';
import { deleteFromCloudinary } from '../../common/middlewares/upload.middleware';
import { In } from 'typeorm';
import { User } from '../user/entities';
import { Course } from '../course/entities/course.entity';
import { Task } from './entities/task.entity';
import { FileTask } from './entities/fileTask.entity';
import { HttpError } from '../../common/libs/http-error';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

export class TaskService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly taskRepository = AppDataSource.getRepository(Task);
  private readonly fileTaskRepository = AppDataSource.getRepository(FileTask);

  async create(
    courseId: string,
    userId: string,
    createTaskDto: CreateTaskDto,
    fileProps: any
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role', 'courses'],
      });

      if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

      const courseData = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['users'],
      });
      if (!courseData) throw HttpError.notFound('Clase no encontrada');

      const isInCourse = courseData.users.some((u) => u.id === userId);
      if (!isInCourse) throw HttpError.forbidden('No perteneces a esta clase');

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
    fileProps: any
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

      if (foundUser.role.name.toLowerCase() !== 'teacher') {
        throw HttpError.forbidden('No eres profesor para actualizar una tarea');
      }

      const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['course'],
      });
      if (!task) throw HttpError.notFound('Tarea no encontrada');

      if (updateTaskDto.title) task.title = updateTaskDto.title;
      if (updateTaskDto.description)
        task.description = updateTaskDto.description;
      if (updateTaskDto.status !== undefined)
        task.status = updateTaskDto.status;
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
      return { msg: 'Tarea actualizada correctamente' };
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
      if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

      if (foundUser.role.name.toLowerCase() !== 'teacher') {
        throw HttpError.forbidden('No eres profesor para eliminar una tarea');
      }

      const courseData = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['users'],
      });
      if (!courseData) throw HttpError.notFound('Clase no encontrada');

      const isInCourse = courseData.users.some((u) => u.id === userId);
      if (!isInCourse) throw HttpError.forbidden('No perteneces a esta clase');

      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) throw HttpError.notFound('Tarea no encontrada');

      const file = await this.fileTaskRepository.findOne({
        where: { task: { id: taskId } },
      });

      let public_id = null;
      if (file) {
        public_id = file.file_id;
        await this.fileTaskRepository.delete({ id: file.id });
      }

      await this.taskRepository.delete({ id: taskId });

      if (public_id) {
        await deleteFromCloudinary(public_id, (e) => {
          if (e)
            throw HttpError.internalServerError('Error al eliminar la imagen');
        });
      }

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
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!courseData) throw HttpError.notFound('Clase no encontrada');

    const isInCourse = courseData.users.some((u) => u.id === userId);
    if (!isInCourse) throw HttpError.forbidden('No perteneces a esta clase');

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
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!courseData) throw HttpError.notFound('Clase no encontrada');

    const isInCourse = courseData.users.some((u) => u.id === userId);
    if (!isInCourse) throw HttpError.forbidden('No perteneces a esta clase');

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) throw HttpError.notFound('Tarea no encontrada');

    const files = await this.fileTaskRepository.find({
      where: { task: { id: taskId } },
    });

    return {
      ...task,
      files,
    };
  }
}
