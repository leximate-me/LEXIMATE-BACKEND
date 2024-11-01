import { createCommentService } from '../services/userComment.service';
import { logger } from '../configs/logger.config';
import { Request, Response } from 'express';

const createCommentController = async (req: Request, res: Response) => {
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
    }
    logger.error(error, 'Error desconocido en createCommentController');
    res.status(500).json({ error: ['Error desconocido'] });
  }
};

export { createCommentController };
