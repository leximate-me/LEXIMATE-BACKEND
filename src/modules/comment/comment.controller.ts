import { Request, Response, NextFunction } from 'express';
import { CommentService } from './comment.service';
import { logger } from '../../common/configs/logger.config';
import { HttpError } from '../../common/libs/http-error';

export class CommentController {
  private commentService: CommentService = new CommentService();

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const commentData = req.body;

      const postId = req.params.postId;

      const userId = req.user?.id;

      const newComment = await this.commentService.create(
        commentData,
        postId,
        userId
      );

      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  }

  async readAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = req.params.postId;

      const comments = await this.commentService.readAll(postId);

      res.status(200).json(comments);
    } catch (error) {
      logger.error(error, 'Error en readsCommentsController');
      next(error);
    }
  }

  async readOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commentId = req.params.commentId;

      const comment = await this.commentService.readOne(commentId);

      res.status(200).json(comment);
    } catch (error) {
      logger.error(error, 'Error en readCommentController');
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const commentData = req.body;

      const commentId = req.params.commentId;

      const userId = req.user?.id;

      const updatedComment = await this.commentService.update(
        commentData,
        commentId,
        userId
      );

      res.status(200).json(updatedComment);
    } catch (error) {
      logger.error(error, 'Error en updateCommentController');
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const commentId = req.params.commentId;

      const userId = req.user?.id;

      const deletedComment = await this.commentService.delete(
        commentId,
        userId
      );

      res.status(200).json(deletedComment);
    } catch (error) {
      next(error);
    }
  }
}
