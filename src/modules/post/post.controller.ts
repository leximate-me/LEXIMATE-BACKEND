import { FastifyRequest, FastifyReply } from 'fastify';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

export class PostController {
  private postService: PostService = new PostService();

  async create(
    request: FastifyRequest<{
      Body: CreatePostDto;
      Params: { courseId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const postData = request.body;
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      const post = await this.postService.create(postData, courseId, userId);
      reply.code(201).send(post);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async readAll(
    request: FastifyRequest<{ Params: { courseId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      const posts = await this.postService.readAll(courseId, userId);
      reply.code(200).send(posts);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async readOne(
    request: FastifyRequest<{ Params: { courseId: string; postId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any)?.id;
      const courseId = request.params.courseId;
      const postId = request.params.postId;

      const post = await this.postService.readOne(userId, courseId, postId);
      reply.code(200).send(post);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Body: UpdatePostDto;
      Params: { courseId: string; postId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const postId = request.params.postId;
      const postData = request.body;
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      const post = await this.postService.update(
        postId,
        postData,
        courseId,
        userId
      );
      reply.code(200).send(post);
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { courseId: string; postId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const postId = request.params.postId;
      const courseId = request.params.courseId;
      const userId = (request.user as any)?.id;

      await this.postService.delete(postId, courseId, userId);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
  }
}
