import { createCommentService } from '../services/userComment.service';
import { logger } from '../configs/logger.config';
import { Request, Response, NextFunction } from 'express';

const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentData = req.body;

    if (!commentData) {
      res.status(400).json({ error: ['Datos no proporcionados'] });
      return;
    }

    const postId = parseInt(req.params.postId);

    if (!postId) {
      res.status(400).json({ error: ['Publicación no proporcionada'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const newComment = await createCommentService(commentData, postId, userId);

    if (!newComment) {
      res.status(400).json({ error: ['Error al crear comentario'] });
    }

    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en createCommentController');
      res.status(400).json({ error: [error.message] });
      next(error);
    }
    logger.error(error, 'Error desconocido en createCommentController');
    res.status(500).json({ error: ['Error desconocido'] });
    next(new Error('Error desconocido'));
  }
};

export { createCommentController };
