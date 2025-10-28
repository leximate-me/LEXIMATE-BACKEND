import { Request, Response, NextFunction } from 'express';
import { logger } from '../../common/configs/logger.config';
import { PostService } from './post.service';

export class PostController {
  private postService: PostService = new PostService();

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postData = req.body;
      const classId = req.params.classId;
      const userId = req.user?.id;

      const post = await this.postService.create(postData, classId, userId);
      res.status(201).json(post);
    } catch (error) {
      logger.error(error, 'Error en createPostController');
      next(error);
    }
  }

  async readAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.classId;
      const userId = req.user?.id;

      const posts = await this.postService.readAll(classId, userId);
      res.status(200).json(posts);
    } catch (error) {
      logger.error(error, 'Error en readPostsController');
      next(error);
    }
  }

  async readOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const classId = req.params.classId;
      const postId = req.params.postId;

      const post = await this.postService.readOne(userId, classId, postId);
      res.status(200).json(post);
    } catch (error) {
      logger.error(error, 'Error en readPostController');
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.postId;
      const postData = req.body;
      const classId = req.params.classId;
      const userId = req.user?.id;

      const post = await this.postService.update(
        postId,
        postData,
        classId,
        userId
      );
      res.status(200).json(post);
    } catch (error) {
      logger.error(error, 'Error en updatePostController');
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.postId;
      const classId = req.params.classId;
      const userId = req.user?.id;

      await this.postService.delete(postId, classId, userId);
      res.status(204).end();
    } catch (error) {
      logger.error(error, 'Error en deletePostController');
      next(error);
    }
  }
}
