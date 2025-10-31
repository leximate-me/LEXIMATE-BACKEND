import { AppDataSource } from '../../database/db';
import { Post } from '../post/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities';
import { HttpError } from '../../common/libs/http-error';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';

export class CommentService {
  private readonly commentRepository = AppDataSource.getRepository(Comment);
  private readonly postRepository = AppDataSource.getRepository(Post);
  private readonly userRepository = AppDataSource.getRepository(User);

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    userId: string
  ) {
    const existingPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['course'],
    });
    if (!existingPost) throw HttpError.notFound('Publicación no encontrada');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInClass = foundUser.courses.some(
      (c) => c.id === existingPost.course.id
    );
    if (!isInClass)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      post: existingPost,
      user: foundUser,
    });
    await this.commentRepository.save(comment);

    return comment;
  }

  async readAll(postId: string) {
    const existingPost = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!existingPost) throw HttpError.notFound('Publicación no encontrada');

    const comments = await this.commentRepository.find({
      where: { post: { id: existingPost.id } },
      relations: ['user', 'user.people', 'user.userFiles', 'post'],
    });

    return comments;
  }

  async readOne(commentId: string) {
    const existingComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'user.people', 'user.userFiles', 'post'],
    });

    if (!existingComment) throw HttpError.notFound('Comentario no encontrado');

    return existingComment;
  }

  async update(
    updateCommentDto: UpdateCommentDto,
    commentId: string,
    userId: string
  ) {
    const existingComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!existingComment) throw HttpError.notFound('Comentario no encontrado');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    if (existingComment.user.id !== foundUser.id) {
      throw HttpError.forbidden(
        'No tiene permisos para editar este comentario'
      );
    }

    if (updateCommentDto.content)
      existingComment.content = updateCommentDto.content;
    await this.commentRepository.save(existingComment);

    return existingComment;
  }

  async delete(commentId: string, userId: string) {
    const existingComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!existingComment) throw HttpError.notFound('Comentario no encontrado');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    if (
      existingComment.user.id !== foundUser.id ||
      foundUser.role.name !== 'admin'
    ) {
      throw HttpError.forbidden(
        'No tiene permisos para eliminar este comentario'
      );
    }

    await this.commentRepository.remove(existingComment);

    return { message: 'Comentario eliminado exitosamente' };
  }
}
