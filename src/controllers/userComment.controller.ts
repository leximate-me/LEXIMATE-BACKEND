import { createCommentService } from '../services/userComment.service';
import { logger } from '../configs/logger.config';
import { Request, Response } from 'express';

const createCommentController = async (req: Request, res: Response) => {
  const commentData = req.body;
  const postId = parseInt(req.params.postId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }
  try {
    const newComment = await createCommentService(commentData, postId, user);

    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en createCommentController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en createCommentController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

export { createCommentController };
