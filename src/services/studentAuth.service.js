import { studentModel } from '../models/student.model.js';
import { teacherModel } from '../models/teacher.model.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';

const registerStudentService = async (studentData) => {
  const {
    firstName,
    lastName,
    age,
    email,
    password,
    token: registrationToken,
  } = studentData;

  const teacherToken = await teacherModel.findOne({
    'generatedTokens.token': registrationToken,
  });

  if (!teacherToken) {
    throw new Error('Token de registro inválido');
  }

  const existUser = await studentModel.findOne({ email });

  if (existUser) {
    throw new Error('El correo ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newStudent = new studentModel({
    firstName,
    lastName,
    age,
    email,
    password: hashedPassword,
    token: registrationToken,
    teacher: teacherToken._id,
  });

  const savedStudent = await newStudent.save();

  const token = await createAccessToken({ id: savedStudent._id });

  return { savedStudent, token };
};

const loginStudentService = async (studentData) => {
  const { email, password } = studentData;

  const studentFound = await studentModel.findOne({ email });

  if (!studentFound) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const isValidPassword = await bcrypt.compare(password, studentFound.password);

  if (!isValidPassword) {
    throw new Error('Correo o contraseña incorrectos');
  }

  if (studentFound.expiresAt < new Date()) {
    const deleteStudent = await studentModel.findByIdAndDelete({
      _id: studentFound._id,
    });
    res.json({ error: ['El token de acceso ha expirado'] });
    return deleteStudent;
  }

  const token = await createAccessToken({ id: studentFound._id });

  return { studentFound, token };
};

const getStudentProfileService = async (studentId) => {
  const existingStudent = await studentModel.findById(studentId);
  if (!existingStudent) {
    throw new Error('Estudiante no encontrado');
  }

  return res.status(200).json({
    id: existingStudent._id,
    firstName: existingStudent.firstName,
    lastName: existingStudent.lastName,
    age: existingStudent.age,
    email: existingStudent.email,
    teacher: existingStudent.teacher,
  });
};

const verifyStudentTokenService = async (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded);
  const existingStudent = await studentModel.findById(decoded.id);

  if (!existingStudent) {
    throw new Error('Estudiante no encontrado');
  }

  const tokenGenerated = existingStudent.token;

  const teacherFound = await teacherModel.findOne({
    'generatedTokens.token': tokenGenerated,
  });

  if (!teacherFound) {
    throw new Error('Token no válido');
  }

  return teacherFound;
};

const logoutStudentService = () => {
  return { message: 'Cerró sesión exitosamente' };
};

export {
  registerStudentService,
  loginStudentService,
  getStudentProfileService,
  verifyStudentTokenService,
  logoutStudentService,
};
