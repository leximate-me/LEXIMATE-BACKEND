import crypto from 'crypto';
import { AppDataSource } from '../../database/db';

import { Post } from '../post/entities/post.entity';
import { Course } from './entities/course.entity';
import { User } from '../auth/entities';
import { Task } from '../task/entities/task.entity';

export class CourseService {
  async create(classData: Partial<Course>, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const verifiedRole = foundUser.role;
      if (!verifiedRole) throw new Error('Rol no encontrado');

      const class_code = crypto.randomBytes(5).toString('hex');
      const newClass = classRepo.create({
        name: classData.name,
        description: classData.description,
        class_code,
      });
      await queryRunner.manager.save(newClass);

      foundUser.courses = [...(foundUser.courses || []), newClass];
      await queryRunner.manager.save(foundUser);

      await queryRunner.commitTransaction();
      return newClass;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async join(classCode: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role', 'courses'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const classData = await classRepo.findOne({
        where: { class_code: classCode },
      });
      if (!classData) throw new Error('Clase no encontrada');

      foundUser.courses = [...(foundUser.courses || []), classData];
      await queryRunner.manager.save(foundUser);

      await queryRunner.commitTransaction();
      return classData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async leave(classId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role', 'courses'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const classData = await classRepo.findOne({ where: { id: classId } });
      if (!classData) throw new Error('Clase no encontrada');

      foundUser.courses = (foundUser.courses || []).filter(
        (c) => c.id !== classId
      );
      await queryRunner.manager.save(foundUser);

      await queryRunner.commitTransaction();
      return classData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCoursesByUser(userId: string) {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'courses'],
    });
    if (!foundUser) throw new Error('Usuario no encontrado');

    return foundUser.courses || [];
  }

  async getUsersByCourses(classId: string) {
    const classRepo = AppDataSource.getRepository(Course);

    const classData = await classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!classData) throw new Error('Clase no encontrada');

    if (!classData.users || classData.users.length === 0)
      throw new Error('No hay usuarios en esta clase');

    return classData.users;
  }

  async update(classId: string, classData: Partial<Course>, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const classFound = await classRepo.findOne({ where: { id: classId } });
      if (!classFound) throw new Error('Clase no encontrada');

      if (classData.name) classFound.name = classData.name;
      if (classData.description) classFound.description = classData.description;

      await queryRunner.manager.save(classFound);

      await queryRunner.commitTransaction();
      return classFound;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(classId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const classRepo = queryRunner.manager.getRepository(Course);
      const taskRepo = queryRunner.manager.getRepository(Task);
      const postRepo = queryRunner.manager.getRepository(Post);

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const classFound = await classRepo.findOne({ where: { id: classId } });
      if (!classFound) throw new Error('Clase no encontrada');

      await taskRepo.delete({ class: { id: classId } });
      await postRepo.delete({ class: { id: classId } });

      await classRepo.delete({ id: classId });

      await queryRunner.commitTransaction();
      return classFound;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
