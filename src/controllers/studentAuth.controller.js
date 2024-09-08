import bcrypt from 'bcryptjs';
import { studentModel } from '../models/student.model.js';
import { teacherModel } from '../models/teacher.model.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';

const registerStudent = async (req, res) => {
  const {
    firstName,
    lastName,
    age,
    email,
    password,
    token: registrationToken,
  } = req.body;

  try {
    const teacherToken = await teacherModel.findOne({
      'generatedTokens.token': registrationToken,
    });

    if (!teacherToken) {
      return res.status(400).json({ error: ['Token inválido'] });
    }

    const existStudent = await studentModel.findOne({ email });
    if (existStudent) {
      return res.status(400).json({ error: ['El email ya está registrado'] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const accesToken = await createAccessToken({ id: savedStudent._id });
    res.cookie('token', accesToken);

    res.status(201).json({
      id: savedStudent._id,
      firstName: savedStudent.firstName,
      lastName: savedStudent.lastName,
      age: savedStudent.age,
      email: savedStudent.email,
      token: savedStudent.token,
      teacher: savedStudent.teacher,
      registeredAt: savedStudent.registeredAt,
      expiresAt: savedStudent.expiresAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const studentFound = await studentModel.findOne({ email });
    if (!studentFound) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }

    const validPassword = await bcrypt.compare(password, studentFound.password);
    if (!validPassword) {
      return res.status(400).json({ error: ['Contraseña incorrecta'] });
    }

    const accesToken = await createAccessToken({ id: studentFound._id });
    res.cookie('token', accesToken);

    res.status(200).json({
      id: studentFound._id,
      firstName: studentFound.firstName,
      lastName: studentFound.lastName,
      age: studentFound.age,
      email: studentFound.email,
      token: studentFound.token,
      teacher: studentFound.teacher,
      registeredAt: studentFound.registeredAt,
      expiresAt: studentFound.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

// Controlador para obtener el perfil del estudiante
const getStudentProfile = async (req, res) => {
  try {
    // Obtener el estudiante autenticado
    const student = await studentModel.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.status(200).json({
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      email: student.email,
      teacher: student.teacher,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Controlador para verificar el token de registro del estudiante
const verifyStudentToken = async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar si el token existe y es válido
    const teacher = await teacherModel.findOne({
      'generatedTokens.token': token,
    });

    if (!teacher) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    res.status(200).json({
      message: 'Token verificado',
      teacher: {
        id: teacher._id,
        name: teacher.firstName + ' ' + teacher.lastName,
        institution: teacher.institution,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

const logoutStudent = async (req, res) => {
  try {
    res.clearCookie('token', '', {
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Sesión cerrada' });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export {
  registerStudent,
  loginStudent,
  getStudentProfile,
  verifyStudentToken,
  logoutStudent,
};
