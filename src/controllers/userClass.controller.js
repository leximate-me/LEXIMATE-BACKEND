import { logger } from '../configs/loggerConfig.js';
import {
  createClassService,
  joinClassService,
  leaveClassService,
  getClassesByUserService,
  getUsersByClassService,
  updateClassService,
  deleteClassService,
} from '../services/userClass.service.js';

// controlador para crear una clase
const createClassController = async (req, res) => {
  const { name, description } = req.body;
  const user = req.user;
  try {
    const newClass = await createClassService({ name, description }, user);
    res.status(201).json(newClass);
  } catch (error) {
    logger.error(error, 'Error en createClassController');
    res.status(400).json({ error: error.message });
  }
};

// controlador para unirse a una clase
const joinClassController = async (req, res) => {
  const { classCode } = req.body;
  const user = req.user;
  try {
    const classData = await joinClassService(classCode, user);
    res.status(200).json(classData);
  } catch (error) {
    logger.error(error, 'Error en joinClassController');
    res.status(400).json({ error: error.message });
  }
};

// controlador para salir de una clase
const leaveClassController = async (req, res) => {
  const { classCode } = req.params;
  const user = req.user;
  try {
    const classData = await leaveClassService(classCode, user);
    res.status(200).json(classData);
  } catch (error) {
    logger.error(error, 'Error en leaveClassController');
    res.status(400).json({ error: error.message });
  }
};

// controlador para obtener las clases de un usuario
const getClassesByUserController = async (req, res) => {
  const user = req.user;
  try {
    const classes = await getClassesByUserService(user);
    res.status(200).json(classes);
  } catch (error) {
    logger.error(error, 'Error en getClassesByUserController');
    res.status(400).json({ error: error.message });
  }
};

// controlador para obtener los usuarios de una clase
const getUsersByClassController = async (req, res) => {
  const { classCode } = req.params;
  try {
    const users = await getUsersByClassService(classCode);
    res.status(200).json(users);
  } catch (error) {
    logger.error(error, 'Error en getUsersByClassController');
    res.status(400).json({ error: error.message });
  }
};

// controlador para actualizar una clase
const updateClassController = async (req, res) => {
  const { name, description } = req.body;
  const { classCode } = req.params;
  const user = req.user;
  try {
    const updatedClass = await updateClassService(
      classCode,
      {
        name,
        description,
      },
      user
    );
    res.status(200).json(updatedClass);
  } catch (error) {
    logger.error(error, 'Error en updateClassController');
    res.status(400).json({ error: error.message });
  }
};

// controlador para eliminar una clase
const deleteClassController = async (req, res) => {
  const { classCode } = req.params;
  const user = req.user;
  try {
    const deletedClass = await deleteClassService(classCode, user);
    res.status(200).json(deletedClass);
  } catch (error) {
    logger.error(error, 'Error en deleteClassController');
    res.status(400).json({ error: error.message });
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
