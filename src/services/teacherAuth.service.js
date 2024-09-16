// services/teacherService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { teacherModel } from '../models/teacher.model.js';
import { createAccessToken } from '../libs/jwt.js';
import { JWT_SECRET } from '../configs/envConfig.js';

/**
 *
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

/**
 *
 * Iniciar sesión de un profesor.
 *
 * @param {string} email - El email del profesor.
 * @param {string} password - La contraseña del profesor.
 * @returns {Object} - Devuelve un objeto que contiene los datos del profesor y el token de acceso.
 * @throws {Error} - Muestra un error si el email o la contraseña son incorrectos.
 */
const loginTeacherService = async (email, password) => {
  const existingTeacher = await teacherModel.findOne({ email });

  // Si el profesor no existe, lanzar un error
  if (!existingTeacher) {
    throw new Error('Correo o contraseña incorrectos');
  }

  // Verificar si la contraseña es correcta
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingTeacher.password
  );

  // Si la contraseña no es correcta, lanzar un error
  if (!isPasswordCorrect) {
    throw new Error('Correo o contraseña incorrectos');
  }

  // Crear un token de acceso con el id del profesor
  const token = await createAccessToken({ id: existingTeacher._id });

  // Devolver el profesor y el token
  return { existingTeacher, token };
};

/**
 * Obtener el perfil de un profesor.
 *
 * @param {string} teacherId - El id del profesor.
 * @returns {Object} - Devuelve un objeto que contiene los datos del profesor.
 * @throws {Error} - Muestra un error si el profesor no existe.
 */

const getTeacherProfileService = async (teacherId) => {
  const existingTeacher = await teacherModel.findById(teacherId);

  // Si el profesor no existe, lanzar un error
  if (!existingTeacher) {
    throw new Error('Usuario no encontrado');
  }

  // Devolver el profesor
  return existingTeacher;
};

/**
 *
 * Cerrar sesión de un profesor.
 *
 * @returns {Object} - Devuelve un mensaje de éxito.
 */
const logoutTeacherService = () => {
  // Devolver un mensaje de éxito
  return { message: 'Cerró sesión exitosamente' };
};

/**
 *
 * Verificar un token de acceso.
 *
 * @param {string} token - El token de acceso.
 * @returns {Object} - Devuelve el token decodificado.
 * @throws {Error} - Muestra un error si el token es inválido.
 */
const verifyTokenService = async (token) => {
  // Si no hay token, lanzar un error
  if (!token) {
    throw new Error('No autorizado');
  }

  // Verificar el token
  const decoded = jwt.verify(token, JWT_SECRET);
  const existingTeacher = await teacherModel.findById(decoded.id);

  // Si el profesor no existe, lanzar un error
  if (!existingTeacher) {
    throw new Error('Usuario no encontrado');
  }

  // Devolver el token decodificado
  return decoded;
};

/**
 *
 * Generar un token de acceso para una clase.
 *
 * @param {string} teacherId - El id del profesor.
 * @param {string} classId - El id de la clase.
 * @returns {Object} - Devuelve un mensaje de éxito y el token generado.
 * @throws {Error} - Muestra un error si el profesor no existe.
 */
const generateTokenService = async (teacherId, classId) => {
  // Verificar si el profesor existe
  const existingTeacher = await teacherModel.findById(teacherId);

  // Si el profesor no existe, lanzar un error
  if (!existingTeacher) {
    throw new Error('Usuario no encontrado');
  }

  // Generar un token de acceso
  const token = await existingTeacher.generateToken(classId);
  existingTeacher.generatedTokens.push({
    token,
    class: classId,
    expiresOn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  // Guardar el profesor en la base de datos
  await existingTeacher.save();

  // Devolver un mensaje de éxito y el token generado
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
