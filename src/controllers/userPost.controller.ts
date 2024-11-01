import {
  createPostService,
  readPostService,
  updatePostService,
  deletePostService,
  readPostsService,
} from '../services/userPost.service';
import { Request, Response } from 'express';
import { logger } from '../configs/logger.config';

const createPostController = async (req: Request, res: Response) => {
  try {
    const postData = req.body;

    if (!postData) {
      res.status(400).json({ message: 'Datos no proporcionados' });
      return;
    }

    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ message: 'Id de clase no proporcionado' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const post = await createPostService(postData, classId, userId);

    if (!post) {
      res.status(404).json({ message: 'Error al crear la publicación' });
      return;
    }

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en createPostController');
      res.status(400).json({ message: error.message });
    }
    logger.error(error, 'Error desconocido en createPostController');
    res.status(500).json({ message: 'Error desconocido' });
  }
};

const readPostsController = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ message: 'Id de clase no proporcionado' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const posts = await readPostsService(classId, userId);

    if (!posts) {
      res.status(404).json({ message: 'Error al leer las publicaciones' });
      return;
    }

    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en readPostsController');
      res.status(400).json({ message: error.message });
    }
    logger.error(error, 'Error desconocido en readPostsController');
    res.status(500).json({ message: 'Error desconocido' });
  }
};

const updatePostController = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);

    if (!postId) {
      res.status(400).json({ message: 'Id de publicación no proporcionado' });
      return;
    }

    const postData = req.body;

    if (!postData) {
      res.status(400).json({ message: 'Datos no proporcionados' });
      return;
    }

    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ message: 'Id de clase no proporcionado' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const post = await updatePostService(postId, postData, classId, userId);

    if (!post) {
      res.status(404).json({ message: 'Error al actualizar la publicación' });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en updatePostController');
      res.status(400).json({ message: error.message });
    }
    logger.error(error, 'Error desconocido en updatePostController');
    res.status(500).json({ message: 'Error desconocido' });
  }
};

const deletePostController = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);

    if (!postId) {
      res.status(400).json({ message: 'Id de publicación no proporcionado' });
      return;
    }

    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ message: 'Id de clase no proporcionado' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const deletePost = await deletePostService(postId, classId, userId);

    if (!deletePost) {
      res.status(404).json({ message: 'Error al eliminar la publicación' });
      return;
    }

    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en deletePostController');
      res.status(400).json({ message: error.message });
    }
    logger.error(error, 'Error desconocido en deletePostController');
    res.status(500).json({ message: 'Error desconocido' });
  }
};

const readPostController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ message: 'Id de clase no proporcionado' });
      return;
    }

    const postId = parseInt(req.params.postId);

    if (!postId) {
      res.status(400).json({ message: 'Id de publicación no proporcionado' });
      return;
    }

    const post = await readPostService(userId, classId, postId);

    if (!post) {
      res.status(404).json({ message: 'Error al leer la publicación' });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en readPostController');
      res.status(400).json({ message: error.message });
    }
    logger.error(error, 'Error desconocido en readPostController');
    res.status(500).json({ message: 'Error desconocido' });
  }
};

export {
  createPostController,
  readPostsController,
  updatePostController,
  deletePostController,
  readPostController,
};
