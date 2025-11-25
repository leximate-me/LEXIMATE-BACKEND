import { AppDataSource } from '@database/db';
import { HttpError } from '@common/libs/http-error';

import { User } from '@user/entities';
import { Course } from '@course/entities/course.entity';
import { Post } from '@post/entities/post.entity';
import { Comment } from '@comment/entities/comment.entity';

import { UpdateCommentDto, CreateCommentDto } from '@comment/dtos';

import { notificationEmitter } from '@common/events/notification.events';
import { NotificationEnum } from '@common/enums/notification.enum';
import { commentEventEmitter } from '@common/events/comment.events';

export class CommentService {
  private readonly commentRepository = AppDataSource.getRepository(Comment);
  private readonly postRepository = AppDataSource.getRepository(Post);
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly courseRepository = AppDataSource.getRepository(Course);

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
        type: NotificationEnum.COMMENT_ADDED,
        title: 'Nuevo comentario en tu post',
        message: `${foundUser.user_name} comentó en tu post: "${postWithAuthor.title}"`,
        data: {
          url: `/courses/${existingPost.course.id}/post/${postWithAuthor.id}`,
          postId: postWithAuthor.id,
          courseId: existingPost.course.id,
          commentId: comment.id,
          commenterName: foundUser.user_name,
        },
      });
    }

    // Emit real-time event for WebSocket broadcast
    const courseWithUsers = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['course'],
    });

    console.log(courseWithUsers);
    if (courseWithUsers?.course) {
      // Cargar usuarios del curso por separado
      const courseWithUsersLoaded = await this.courseRepository.findOne({
        where: { id: courseWithUsers.course.id },
        relations: ['users'],
      });

      if (courseWithUsersLoaded?.users) {
        commentEventEmitter.emit('comment_created', {
          comment: {
            id: comment.id,
            content: comment.content,
            postId: existingPost.id,
            authorId: foundUser.id,
            authorName: foundUser.user_name,
            createdAt: comment.created_at,
          },
          userIds: courseWithUsersLoaded.users.map((u) => u.id),
        });
      }
    }

    return comment;
  }

  async readAll(postId: string, page: number = 1, limit: number = 20) {
    const existingPost = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!existingPost) throw HttpError.notFound('Post not found');

    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { post: { id: existingPost.id } },
      relations: ['user', 'user.people', 'user.userFiles', 'post'],
      order: { created_at: 'ASC' },
      skip,
      take: limit,
    });

    return Object.assign(comments, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
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

    // Emit real-time event for WebSocket broadcast
    const updatedComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post', 'post.course', 'user'],
    });

    if (updatedComment?.post?.course) {
      const courseWithUsers = await this.courseRepository.findOne({
        where: { id: updatedComment.post.course.id },
        relations: ['users'],
      });

      if (courseWithUsers?.users) {
        commentEventEmitter.emit('comment_updated', {
          comment: updatedComment,
          userIds: courseWithUsers.users.map((u) => u.id),
        });
      }
    }

    return existingComment;
  }

  async delete(commentId: string, userId: string) {
    const existingComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'post', 'post.course', 'post.course.users'],
    });
    if (!existingComment) throw HttpError.notFound('Comment not found');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'courses'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const isAuthor = existingComment.user.id === foundUser.id;
    const isAdmin = foundUser.role.name === 'admin';
    
    // Check if user is a teacher in the course where the comment was made
    const isTeacherInCourse = 
      foundUser.role.name === 'teacher' &&
      foundUser.courses.some((course) => course.id === existingComment.post.course.id);

    if (!isAuthor && !isAdmin && !isTeacherInCourse) {
      throw HttpError.forbidden(
        'You do not have permission to delete this comment.'
      );
    }

    await this.commentRepository.softDelete(existingComment);

    // Emit real-time event for WebSocket broadcast
    commentEventEmitter.emit('comment_deleted', {
      commentId,
      postId: existingComment.post.id,
      userIds: existingComment.post.course.users.map((u) => u.id),
    });

    return { message: 'Comment successfully deleted' };
  }
}
