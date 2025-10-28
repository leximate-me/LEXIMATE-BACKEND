import { AppDataSource } from '../../database/db';
import { Post } from '../post/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities';

export class CommentService {
  async create(commentData: Partial<Comment>, postId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const postRepo = queryRunner.manager.getRepository(Post);
      const userRepo = queryRunner.manager.getRepository(User);
      const commentRepo = queryRunner.manager.getRepository(Comment);

      const existingPost = await postRepo.findOne({
        where: { id: postId },
        relations: ['class'],
      });
      if (!existingPost) throw new Error('Publicación no encontrada');

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['courses'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      // Verifica que el usuario pertenece a la clase de la publicación
      const isInClass = foundUser.courses.some(
        (c) => c.id === existingPost.class.id
      );
      if (!isInClass) throw new Error('El usuario no pertenece a la clase');

      const comment = commentRepo.create({
        content: commentData.content,
        post: existingPost,
        user: foundUser,
      });
      await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();
      return comment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async readAll(postId: string) {
    const postRepo = AppDataSource.getRepository(Post);
    const commentRepo = AppDataSource.getRepository(Comment);

    const existingPost = await postRepo.findOne({ where: { id: postId } });
    if (!existingPost) throw new Error('Publicación no encontrada');

    const comments = await commentRepo.find({
      where: { post: { id: existingPost.id } },
      relations: ['user', 'user.people', 'user.fileUsers', 'post'],
    });

    return comments;
  }

  async readOne(commentId: string) {
    const commentRepo = AppDataSource.getRepository(Comment);

    const existingComment = await commentRepo.findOne({
      where: { id: commentId },
      relations: ['user', 'user.people', 'user.fileUsers', 'post'],
    });

    if (!existingComment) throw new Error('Comentario no encontrado');

    return existingComment;
  }

  async update(
    commentData: Partial<Comment>,
    commentId: string,
    userId: string
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const commentRepo = queryRunner.manager.getRepository(Comment);
      const userRepo = queryRunner.manager.getRepository(User);

      const existingComment = await commentRepo.findOne({
        where: { id: commentId },
        relations: ['user'],
      });
      if (!existingComment) throw new Error('Comentario no encontrado');

      const foundUser = await userRepo.findOne({ where: { id: userId } });
      if (!foundUser) throw new Error('Usuario no encontrado');

      if (existingComment.user.id !== foundUser.id) {
        throw new Error('No tiene permisos para editar este comentario');
      }

      if (commentData.content) existingComment.content = commentData.content;
      await queryRunner.manager.save(existingComment);

      await queryRunner.commitTransaction();
      return existingComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(commentId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const commentRepo = queryRunner.manager.getRepository(Comment);
      const userRepo = queryRunner.manager.getRepository(User);

      const existingComment = await commentRepo.findOne({
        where: { id: commentId },
        relations: ['user'],
      });
      if (!existingComment) throw new Error('Comentario no encontrado');

      const foundUser = await userRepo.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (!foundUser) throw new Error('Usuario no encontrado');

      // Solo el autor o un usuario con rol 'admin' puede eliminar
      if (
        existingComment.user.id !== foundUser.id &&
        foundUser.role.name !== 'admin'
      ) {
        throw new Error('No tiene permisos para eliminar este comentario');
      }

      await queryRunner.manager.remove(existingComment);

      await queryRunner.commitTransaction();
      return { message: 'Comentario eliminado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
