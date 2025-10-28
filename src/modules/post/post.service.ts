import { AppDataSource } from '../../database/db';
import { User } from '../user/entities';

import { Course } from '../course/entities/course.entity';
import { Post } from './entities/post.entity';

export class PostService {
  async create(postData: Partial<Post>, classId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const classRepo = queryRunner.manager.getRepository(Course);
      const userRepo = queryRunner.manager.getRepository(User);
      const postRepo = queryRunner.manager.getRepository(Post);

      const existingClass = await classRepo.findOne({
        where: { id: classId },
        relations: ['users'],
      });
      if (!existingClass) throw new Error('Clase no encontrada');

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['courses'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const isInClass = foundUser.courses.some((c) => c.id === classId);
      if (!isInClass) throw new Error('El usuario no pertenece a la clase');

      const post = postRepo.create({
        title: postData.title,
        content: postData.content,
        class: existingClass,
        user: foundUser,
      });
      await queryRunner.manager.save(post);

      await queryRunner.commitTransaction();
      return post;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async readAll(classId: string, userId: string) {
    const classRepo = AppDataSource.getRepository(Course);
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);

    const existingClass = await classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw new Error('Clase no encontrada');

    const foundUser = await userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw new Error('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass) throw new Error('El usuario no pertenece a la clase');

    const posts = await postRepo.find({
      where: { class: { id: classId } },
      relations: ['user', 'user.people', 'class'],
    });

    return posts;
  }

  async readOne(userId: string, classId: string, postId: string) {
    const classRepo = AppDataSource.getRepository(Course);
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);

    const existingClass = await classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw new Error('Clase no encontrada');

    const foundUser = await userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw new Error('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass) throw new Error('El usuario no pertenece a la clase');

    const post = await postRepo.findOne({
      where: { id: postId, class: { id: classId } },
      relations: ['user', 'user.people', 'class'],
    });

    if (!post) throw new Error('Publicación no encontrada');

    return post;
  }

  async update(
    postId: string,
    postData: Partial<Post>,
    classId: string,
    userId: string
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const classRepo = queryRunner.manager.getRepository(Course);
      const userRepo = queryRunner.manager.getRepository(User);
      const postRepo = queryRunner.manager.getRepository(Post);

      const existingClass = await classRepo.findOne({
        where: { id: classId },
        relations: ['users'],
      });
      if (!existingClass) throw new Error('Clase no encontrada');

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['courses'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const isInClass = foundUser.courses.some((c) => c.id === classId);
      if (!isInClass) throw new Error('El usuario no pertenece a la clase');

      const post = await postRepo.findOne({
        where: { id: postId, class: { id: classId }, user: { id: userId } },
      });
      if (!post) throw new Error('Publicación no encontrada');

      if (postData.title) post.title = postData.title;
      if (postData.content) post.content = postData.content;

      await queryRunner.manager.save(post);

      await queryRunner.commitTransaction();
      return post;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(postId: string, classId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const classRepo = queryRunner.manager.getRepository(Course);
      const userRepo = queryRunner.manager.getRepository(User);
      const postRepo = queryRunner.manager.getRepository(Post);

      const existingClass = await classRepo.findOne({
        where: { id: classId },
        relations: ['users'],
      });
      if (!existingClass) throw new Error('Clase no encontrada');

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['courses'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      const isInClass = foundUser.courses.some((c) => c.id === classId);
      if (!isInClass) throw new Error('El usuario no pertenece a la clase');

      const post = await postRepo.findOne({
        where: { id: postId, class: { id: classId } },
      });
      if (!post) throw new Error('Publicación no encontrada');

      await queryRunner.manager.remove(post);

      await queryRunner.commitTransaction();
      return { message: 'Publicación eliminada correctamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
