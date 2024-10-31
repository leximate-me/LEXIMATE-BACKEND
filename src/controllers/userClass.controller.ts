import { logger } from '../configs/logger.config';
import {
  createClassService,
  joinClassService,
  leaveClassService,
  getClassesByUserService,
  getUsersByClassService,
  updateClassService,
  deleteClassService,
} from '../services/userClass.service';
import { Request, Response } from 'express';

// controlador para crear una clase
const createClassController = async (req: Request, res: Response) => {
  const classData = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }

  try {
    const newClass = await createClassService(classData, user);
    res.status(201).json(newClass);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en createClassController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en createClassController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

// controlador para unirse a una clase
const joinClassController = async (req: Request, res: Response) => {
  const { classCode } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }

  try {
    const classData = await joinClassService(classCode, user);
    res.status(200).json(classData);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en joinClassController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en joinClassController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

// controlador para salir de una clase
const leaveClassController = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }
  try {
    const classData = await leaveClassService(classId, user);
    res.status(200).json(classData);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en leaveClassController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en leaveClassController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

// controlador para obtener las clases de un usuario
const getClassesByUserController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }
  try {
    const classes = await getClassesByUserService(user);
    res.status(200).json(classes);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en getClassesByUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en getClassesByUserController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

// controlador para obtener los usuarios de una clase
const getUsersByClassController = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.classId);
  try {
    const users = await getUsersByClassService(classId);
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en getUsersByClassController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en getUsersByClassController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

// controlador para actualizar una clase
const updateClassController = async (req: Request, res: Response) => {
  const classData = req.body;
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }
  try {
    const updatedClass = await updateClassService(classId, classData, user);
    res.status(200).json(updatedClass);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en updateClassController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en updateClassController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

// controlador para eliminar una clase
const deleteClassController = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.classId);
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: ['Usuario no autenticado'] });
    return;
  }
  try {
    await deleteClassService(classId, user);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en deleteClassController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en deleteClassController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

export {
  createClassController,
  joinClassController,
  leaveClassController,
  getClassesByUserController,
  getUsersByClassController,
  updateClassController,
  deleteClassController,
};
