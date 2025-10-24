import { Request, Response } from 'express';
import { logger } from '../../common/configs/logger.config';
import { PostService } from './post.service';

export class PostController {
  private postService: PostService = new PostService();

  async create(req: Request, res: Response): Promise<void> {
    try {
      const postData = req.body;
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!postData || !classId || !userId) {
        res.status(400).json({ message: 'Datos insuficientes' });
        return;
      }

      const post = await this.postService.create(postData, classId, userId);
      res.status(201).json(post);
    } catch (error) {
      logger.error(error, 'Error en createPostController');
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async readAll(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!classId || !userId) {
        res.status(400).json({ message: 'Datos insuficientes' });
        return;
      }

      const posts = await this.postService.readAll(classId, userId);
      res.status(200).json(posts);
    } catch (error) {
      logger.error(error, 'Error en readPostsController');
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async readOne(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const classId = req.params.classId;
      const postId = req.params.postId;

      if (!userId || !classId || !postId) {
        res.status(400).json({ message: 'Datos insuficientes' });
        return;
      }

      const post = await this.postService.readOne(userId, classId, postId);
      res.status(200).json(post);
    } catch (error) {
      logger.error(error, 'Error en readPostController');
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      const postData = req.body;
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!postId || !postData || !classId || !userId) {
        res.status(400).json({ message: 'Datos insuficientes' });
        return;
      }

      const post = await this.postService.update(
        postId,
        postData,
        classId,
        userId
      );
      res.status(200).json(post);
    } catch (error) {
      logger.error(error, 'Error en updatePostController');
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      const classId = req.params.classId;
      const userId = req.user?.id;

      if (!postId || !classId || !userId) {
        res.status(400).json({ message: 'Datos insuficientes' });
        return;
      }

      await this.postService.delete(postId, classId, userId);
      res.status(204).end();
    } catch (error) {
      logger.error(error, 'Error en deletePostController');
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
