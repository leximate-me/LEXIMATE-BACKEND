import { FastifyRequest, FastifyReply } from 'fastify';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

export class CommentController {
  private commentService: CommentService = new CommentService();

  async create(
    request: FastifyRequest<{
      Body: CreateCommentDto;
      Params: { postId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const commentData = request.body;
      const postId = request.params.postId;
      const userId = (request.user as any)?.id;

      const newComment = await this.commentService.create(
        commentData,
        postId,
        userId
      );

      reply.code(201).send(newComment);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async readAll(
    request: FastifyRequest<{ Params: { postId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const postId = request.params.postId;
      const comments = await this.commentService.readAll(postId);
      reply.code(200).send(comments);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async readOne(
    request: FastifyRequest<{ Params: { commentId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const commentId = request.params.commentId;
      const comment = await this.commentService.readOne(commentId);
      reply.code(200).send(comment);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Body: UpdateCommentDto;
      Params: { commentId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const commentData = request.body;
      const commentId = request.params.commentId;
      const userId = (request.user as any)?.id;

      const updatedComment = await this.commentService.update(
        commentData,
        commentId,
        userId
      );

      reply.code(200).send(updatedComment);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { commentId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const commentId = request.params.commentId;
      const userId = (request.user as any)?.id;

      const deletedComment = await this.commentService.delete(
        commentId,
        userId
      );

      reply.code(200).send(deletedComment);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }
}
