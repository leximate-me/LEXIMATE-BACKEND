import {
  createPostService,
  readPostService,
  updatePostService,
  deletePostService,
  readPostsService,
} from '../services/userPost.service';
import { Request, Response } from 'express';
import { logger } from '../configs/loggerConfig';

const createPostController = async (req: Request, res: Response) => {
  const postData = req.body;
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }
  try {
    const post = await createPostService(postData, classId, user);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en createPostController');
      res.status(400).json({ message: error.message });
    } else {
      logger.error(error, 'Error desconocido en createPostController');
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

const readPostsController = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }
  try {
    const posts = await readPostsService(classId, user);
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en readPostsController');
      res.status(400).json({ message: error.message });
    } else {
      logger.error(error, 'Error desconocido en readPostsController');
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

const updatePostController = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const postData = req.body;
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }
  try {
    const post = await updatePostService(postId, postData, classId, user);
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en updatePostController');
      res.status(400).json({ message: error.message });
    } else {
      logger.error(error, 'Error desconocido en updatePostController');
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

const deletePostController = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }
  try {
    await deletePostService(postId, classId, user);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en deletePostController');
      res.status(400).json({ message: error.message });
    } else {
      logger.error(error, 'Error desconocido en deletePostController');
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

const readPostController = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.classId);
    const user = req.user;
    const postId = parseInt(req.params.postId);

    if (!user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const posts = await readPostService(classId, user, postId);
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en readPostController');
      res.status(400).json({ message: error.message });
    } else {
      logger.error(error, 'Error desconocido en readPostController');
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export {
  createPostController,
  readPostsController,
  updatePostController,
  deletePostController,
  readPostController,
};
