import { AppDataSource } from '@database/db';
import { HttpError } from '@common/libs/http-error';

import { Post } from '@post/entities/post.entity';
import { Comment } from '@comment/entities/comment.entity';
import { User } from '@user/entities';

import { UpdateCommentDto, CreateCommentDto } from '@comment/dtos';

import { notificationEmitter } from '@common/events/notification.events';
import { NotificationType } from '@notification/entities/notification.entity';

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
    if (!existingPost) throw HttpError.notFound('Post not found');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const isInClass = foundUser.courses.some(
      (c) => c.id === existingPost.course.id
    );
    if (!isInClass)
      throw HttpError.forbidden('The user does not belong to the class');

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      post: existingPost,
      user: foundUser,
    });
    await this.commentRepository.save(comment);

    // Notify post author about new comment
    const postWithAuthor = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    
    if (postWithAuthor && postWithAuthor.user.id !== userId) {
      notificationEmitter.emit('create_notification', {
        userId: postWithAuthor.user.id,
        type: NotificationType.COMMENT_ADDED,
        title: 'Nuevo comentario en tu post',
        message: `${foundUser.user_name} comentó en tu post: "${postWithAuthor.title}"`,
        data: {
          postId: postWithAuthor.id,
          commentId: comment.id,
          commenterName: foundUser.user_name,
        },
      });
    }

    return comment;
  }

  async readAll(postId: string) {
    const existingPost = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!existingPost) throw HttpError.notFound('Post not found');

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

    if (!existingComment) throw HttpError.notFound('Comment not found');

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
    if (!existingComment) throw HttpError.notFound('Comment not founds');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    if (existingComment.user.id !== foundUser.id) {
      throw HttpError.forbidden(
        'You do not have permission to edit this comment.'
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
    if (!existingComment) throw HttpError.notFound('Comment not found');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    if (
      existingComment.user.id !== foundUser.id ||
      foundUser.role.name !== 'admin'
    ) {
      throw HttpError.forbidden(
        'You do not have permission to delete this comment.'
      );
    }

    await this.commentRepository.remove(existingComment);

    return { message: 'Comment successfully deleted' };
  }
}
