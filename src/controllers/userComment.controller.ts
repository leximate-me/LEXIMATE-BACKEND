import {
  createCommentService,
  readCommentsService,
  readCommentService,
  updateCommentService,
  deleteCommentService,
} from '../services/userComment.service';
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
    } else {
      logger.error(error, 'Error desconocido en createCommentController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const readCommentsController = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);

    if (!postId) {
      res.status(400).json({ error: ['Publicación no proporcionada'] });
      return;
    }

    const comments = await readCommentsService(postId);

    if (!comments) {
      res.status(400).json({ error: ['Error al leer comentarios'] });
    }

    res.status(200).json(comments);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en readsCommentsController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en readsCommentsController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const readCommentController = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (!commentId) {
      res.status(400).json({ error: ['Comentario no proporcionado'] });
      return;
    }

    const comment = await readCommentService(commentId);

    if (!comment) {
      res.status(400).json({ error: ['Error al leer comentario'] });
    }

    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en readCommentController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en readCommentController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const updateCommentController = async (req: Request, res: Response) => {
  try {
    const commentData = req.body;

    if (!commentData) {
      res.status(400).json({ error: ['Datos no proporcionados'] });
      return;
    }

    const commentId = parseInt(req.params.commentId);

    if (!commentId) {
      res.status(400).json({ error: ['Comentario no proporcionado'] });
      return;
    }
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const updatedComment = await updateCommentService(
      commentData,
      commentId,
      userId
    );

    if (!updatedComment) {
      res.status(400).json({ error: ['Error al actualizar comentario'] });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en updateCommentController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en updateCommentController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (!commentId) {
      res.status(400).json({ error: ['Comentario no proporcionado'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const deletedComment = await deleteCommentService(commentId, userId);

    if (!deletedComment) {
      res.status(400).json({ error: ['Error al eliminar comentario'] });
    }

    res.status(200).json(deletedComment);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en deleteCommentController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en deleteCommentController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

export {
  createCommentController,
  readCommentsController,
  readCommentController,
  updateCommentController,
  deleteCommentController,
};
