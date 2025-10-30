import { FastifyRequest, FastifyReply } from 'fastify';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

export class PostController {
  private postService: PostService = new PostService();

  async create(
    request: FastifyRequest<{
      Body: CreatePostDto;
      Params: { classId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const postData = request.body;
      const classId = request.params.classId;
      const userId = (request.user as any)?.id;

      const post = await this.postService.create(postData, classId, userId);
      reply.code(201).send(post);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async readAll(
    request: FastifyRequest<{ Params: { classId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const classId = request.params.classId;
      const userId = (request.user as any)?.id;

      const posts = await this.postService.readAll(classId, userId);
      reply.code(200).send(posts);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async readOne(
    request: FastifyRequest<{ Params: { classId: string; postId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any)?.id;
      const classId = request.params.classId;
      const postId = request.params.postId;

      const post = await this.postService.readOne(userId, classId, postId);
      reply.code(200).send(post);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Body: UpdatePostDto;
      Params: { classId: string; postId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const postId = request.params.postId;
      const postData = request.body;
      const classId = request.params.classId;
      const userId = (request.user as any)?.id;

      const post = await this.postService.update(
        postId,
        postData,
        classId,
        userId
      );
      reply.code(200).send(post);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { classId: string; postId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const postId = request.params.postId;
      const classId = request.params.classId;
      const userId = (request.user as any)?.id;

      await this.postService.delete(postId, classId, userId);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }
}
