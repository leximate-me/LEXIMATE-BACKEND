import { AppDataSource } from '../../database/db';
import { deleteFromCloudinary } from '../../common/middlewares/upload.middleware';
import { In } from 'typeorm';
import { User } from '../user/entities';
import { Course } from '../course/entities/course.entity';
import { Task } from './entities/task.entity';
import { FileTask } from './entities/fileTask.entity';
import { HttpError } from '../../common/libs/http-error';

export class TaskService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly classRepository = AppDataSource.getRepository(Course);
  private readonly taskRepository = AppDataSource.getRepository(Task);
  private readonly fileTaskRepository = AppDataSource.getRepository(FileTask);

  async create(
    classId: string,
    userId: string,
    taskData: Partial<Task>,
    fileProps: any
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);
      const taskRepo = queryRunner.manager.getRepository(Task);
      const fileTaskRepo = queryRunner.manager.getRepository(FileTask);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role', 'courses'],
      });
      if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

      if (foundUser.role.name.toLowerCase() !== 'teacher') {
        throw HttpError.forbidden(
          'No eres profesor para crear una tarea en esta clase'
        );
      }

      const classData = await classRepo.findOne({
        where: { id: classId },
        relations: ['users'],
      });
      if (!classData) throw HttpError.notFound('Clase no encontrada');

      const isInClass = classData.users.some((u) => u.id === userId);
      if (!isInClass) throw HttpError.forbidden('No perteneces a esta clase');

      const newTask = taskRepo.create({
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date,
        class: classData,
      });
      await queryRunner.manager.save(newTask);

      if (fileProps) {
        const { fileUrl, fileId, fileType } = fileProps;
        const newFileTask = fileTaskRepo.create({
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
    taskData: Partial<Task>,
    fileProps: any
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const taskRepo = queryRunner.manager.getRepository(Task);
      const fileTaskRepo = queryRunner.manager.getRepository(FileTask);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

      if (foundUser.role.name.toLowerCase() !== 'teacher') {
        throw HttpError.forbidden('No eres profesor para actualizar una tarea');
      }

      const task = await taskRepo.findOne({
        where: { id: taskId },
        relations: ['class'],
      });
      if (!task) throw HttpError.notFound('Tarea no encontrada');

      if (taskData.title) task.title = taskData.title;
      if (taskData.description) task.description = taskData.description;
      if (taskData.status !== undefined) task.status = taskData.status;
      if (taskData.due_date) task.due_date = taskData.due_date;

      await queryRunner.manager.save(task);

      if (fileProps) {
        const { fileUrl, fileId, fileType } = fileProps;
        let fileTask = await fileTaskRepo.findOne({
          where: { task: { id: taskId } },
        });
        if (fileTask) {
          fileTask.file_url = fileUrl;
          fileTask.file_id = fileId;
          fileTask.file_type = fileType;
          await queryRunner.manager.save(fileTask);
        } else {
          fileTask = fileTaskRepo.create({
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

  async delete(taskId: string, classId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);
      const taskRepo = queryRunner.manager.getRepository(Task);
      const fileTaskRepo = queryRunner.manager.getRepository(FileTask);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role', 'courses'],
      });
      if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

      if (foundUser.role.name.toLowerCase() !== 'teacher') {
        throw HttpError.forbidden('No eres profesor para eliminar una tarea');
      }

      const classData = await classRepo.findOne({
        where: { id: classId },
        relations: ['users'],
      });
      if (!classData) throw HttpError.notFound('Clase no encontrada');

      const isInClass = classData.users.some((u) => u.id === userId);
      if (!isInClass) throw HttpError.forbidden('No perteneces a esta clase');

      const task = await taskRepo.findOne({ where: { id: taskId } });
      if (!task) throw HttpError.notFound('Tarea no encontrada');

      const file = await fileTaskRepo.findOne({
        where: { task: { id: taskId } },
      });

      let public_id = null;
      if (file) {
        public_id = file.file_id;
        await fileTaskRepo.delete({ id: file.id });
      }

      await taskRepo.delete({ id: taskId });

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

  async getAllByClass(classId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const classData = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!classData) throw HttpError.notFound('Clase no encontrada');

    const isInClass = classData.users.some((u) => u.id === userId);
    if (!isInClass) throw HttpError.forbidden('No perteneces a esta clase');

    const tasks = await this.taskRepository.find({
      where: { class: { id: classId } },
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

  async getOne(taskId: string, classId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const classData = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!classData) throw HttpError.notFound('Clase no encontrada');

    const isInClass = classData.users.some((u) => u.id === userId);
    if (!isInClass) throw HttpError.forbidden('No perteneces a esta clase');

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
