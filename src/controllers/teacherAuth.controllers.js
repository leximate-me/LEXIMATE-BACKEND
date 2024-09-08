import bcrypt from 'bcryptjs';
import { teacherModel } from '../models/teacher.model.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';

const register = async (req, res) => {
  const { firstName, lastName, institution, email, password } = req.body;

  try {
    const existTeacher = await teacherModel.findOne({ email });
    if (existTeacher) {
      return res.status(400).json({ error: ['El email ya está registrado'] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new teacherModel({
      firstName,
      lastName,
      institution,
      email,
      password: hashedPassword,
    });

    const savedTeacher = await newTeacher.save();
    const token = await createAccessToken({ id: savedTeacher._id });

    res.cookie('token', token);
    res.status(201).json({
      id: savedTeacher._id,
      firstName: savedTeacher.firstName,
      lastName: savedTeacher.lastName,
      institution: savedTeacher.institution,
      email: savedTeacher.email,
      verify: savedTeacher.verify,
      classes: savedTeacher.classes,
      generatedTokens: savedTeacher.generatedTokens,
      createdAt: savedTeacher.createdAt,
      updatedAt: savedTeacher.updatedAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacherFound = await teacherModel.findOne({ email });
    if (!teacherFound) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }

    const validPassword = await bcrypt.compare(password, teacherFound.password);
    if (!validPassword) {
      return res.status(400).json({ error: ['Contraseña incorrecta'] });
    }

    const token = await createAccessToken({ id: teacherFound._id });

    res.cookie('token', token);

    res.status(200).json({
      id: teacherFound._id,
      firstName: teacherFound.firstName,
      lastName: teacherFound.lastName,
      institution: teacherFound.institution,
      email: teacherFound.email,
      verify: teacherFound.verify,
      classes: teacherFound.classes,
      generatedTokens: teacherFound.generatedTokens,
      createdAt: teacherFound.createdAt,
      updatedAt: teacherFound.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', '', {
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Sesión cerrada' });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const profile = async (req, res) => {
  try {
    const teacherFound = await teacherModel.findById(req.user.id);
    if (!teacherFound) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }

    return res.status(200).json({
      id: teacherFound._id,
      firstName: teacherFound.firstName,
      lastName: teacherFound.lastName,
      institution: teacherFound.institution,
      email: teacherFound.email,
      verify: teacherFound.verify,
      classes: teacherFound.classes,
      generatedTokens: teacherFound.generatedTokens,
      createdAt: teacherFound.createdAt,
      updatedAt: teacherFound.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  console.log(req.cookies);

  if (!token) {
    return res.status(401).json({ error: ['No autorizado'] });
  }

  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({ error: ['No autorizado'] });
      }
      const teacherFound = await teacherModel.findById(user.id);
      if (!teacherFound) {
        return res.status(404).json({ error: ['Usuario no encontrado'] });
      }
      return res.status(200).json({
        id: teacherFound._id,
        firstName: teacherFound.firstName,
        lastName: teacherFound.lastName,
        institution: teacherFound.institution,
        email: teacherFound.email,
        verify: teacherFound.verify,
        classes: teacherFound.classes,
        generatedTokens: teacherFound.generatedTokens,
        createdAt: teacherFound.createdAt,
        updatedAt: teacherFound.updatedAt,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { register, login, logout, profile, verifyToken };
