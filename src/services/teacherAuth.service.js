// services/teacherService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { teacherModel } from '../models/teacher.model.js';
import { createAccessToken } from '../libs/jwt.js';
import { JWT_SECRET } from '../configs/envConfig.js';

/**
 * Registro de un nuevo profesor.
 *
 * @author sr-roboto
 * @param {Object} teacherData - La Data del profesor que va a ser registrado.
 * @param {string} teacherData.email - El email del profesor.
 * @param {string} teacherData.password - La contraseña del profesor.
 * @returns {Object} - Devuelve un objeto que contiene los datos del profesor y el token de acceso.
 * @throws {Error} - Muesta un error si el email ya esta registrado.
 */

const registerTeacherService = async (teacherData) => {
  const { email, password } = teacherData;

  // Verificar si el profesor ya está registrado
  const existingTeacher = await teacherModel.findOne({ email });

  // Si el profesor ya está registrado, lanzar un error
  if (existingTeacher) {
    throw new Error('El correo ya está registrado');
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 12);

  // Crear un nuevo profesor con la contraseña encriptada
  const newTeacher = new teacherModel({
    ...teacherData,
    password: hashedPassword,
  });

  // Guardar el profesor en la base de datos
  const savedTeacher = await newTeacher.save();

  // Crear un token de acceso con el id del profesor
  const token = await createAccessToken({ id: savedTeacher._id });

  return { savedTeacher, token };
};

const loginTeacherService = async (email, password) => {
  const existingTeacher = await teacherModel.findOne({ email });

  if (!existingTeacher) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingTeacher.password
  );

  if (!isPasswordCorrect) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const token = await createAccessToken({ id: existingTeacher._id });

  return { existingTeacher, token };
};

const getTeacherProfileService = async (teacherId) => {
  const existingTeacher = await teacherModel.findById(teacherId);

  if (!existingTeacher) {
    throw new Error('Usuario no encontrado');
  }

  return existingTeacher;
};

const logoutTeacherService = () => {
  return { message: 'Cerró sesión exitosamente' };
};

const verifyTokenService = async (token) => {
  if (!token) {
    throw new Error('No autorizado');
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const existingTeacher = await teacherModel.findById(decoded.id);

  if (!existingTeacher) {
    throw new Error('Usuario no encontrado');
  }

  return decoded;
};

const generateTokenService = async (teacherId, classId) => {
  const existingTeacher = await teacherModel.findById(teacherId);

  if (!existingTeacher) {
    throw new Error('Usuario no encontrado');
  }

  const token = await existingTeacher.generateToken(classId);
  existingTeacher.generatedTokens.push({
    token,
    class: classId,
    expiresOn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  await existingTeacher.save();

  return { message: 'Token generado exitosamente', token };
};

export {
  registerTeacherService,
  loginTeacherService,
  getTeacherProfileService,
  logoutTeacherService,
  verifyTokenService,
  generateTokenService,
};
