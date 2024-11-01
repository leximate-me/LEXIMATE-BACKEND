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
  try {
    const classData = req.body;

    if (!classData) {
      res.status(400).json({ error: ['Falta la información de la clase'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const newClass = await createClassService(classData, userId);

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
  try {
    const { classCode } = req.body;

    if (!classCode) {
      res.status(400).json({ error: ['Falta el código de la clase'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const classData = await joinClassService(classCode, userId);

    if (!classData) {
      res.status(404).json({ error: ['Clase no encontrada'] });
      return;
    }

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
  try {
    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ error: ['Falta el id de la clase'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }
    const classData = await leaveClassService(classId, userId);

    if (!classData) {
      res.status(404).json({ error: ['Clase no encontrada'] });
      return;
    }

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
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const classes = await getClassesByUserService(userId);

    if (!classes) {
      res.status(404).json({ error: ['Clases no encontradas'] });
      return;
    }

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
  try {
    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ error: ['Falta el id de la clase'] });
      return;
    }

    const users = await getUsersByClassService(classId);

    if (!users) {
      res.status(404).json({ error: ['Usuarios no encontrados'] });
      return;
    }

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
  try {
    const classData = req.body;

    if (!classData) {
      res.status(400).json({ error: ['Falta la información de la clase'] });
      return;
    }

    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ error: ['Falta el id de la clase'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }

    const updatedClass = await updateClassService(classId, classData, userId);

    if (!updatedClass) {
      res.status(404).json({ error: ['Clase no encontrada'] });
      return;
    }

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
  try {
    const classId = parseInt(req.params.classId);

    if (!classId) {
      res.status(400).json({ error: ['Falta el id de la clase'] });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: ['Usuario no autenticado'] });
      return;
    }
    const deleteClass = await deleteClassService(classId, userId);

    if (!deleteClass) {
      res.status(404).json({ error: ['Clase no encontrada'] });
      return;
    }

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
