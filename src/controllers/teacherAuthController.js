import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { teacherModel } from '../models/teacher.model';
import { createAccessToken } from '../libs/jwt.js';
import { JWT_SECRET } from '../configs/envConfig.js';

const registerTeacher = async (req, res) => {
  const {
    firstName,
    lastName,
    dni,
    birthdate,
    email,
    phone,
    institution,
    password,
  } = req.body;

  try {
    const existingTeacher = await teacherModel.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({ error: ['El correo ya está registrado'] });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newTeacher = new teacherModel({
      firstName,
      lastName,
      dni,
      birthdate,
      email,
      phone,
      institution,
      password: hashedPassword,
    });

    const savedTeacher = await newTeacher.save();

    const token = createAccessToken({ id: savedTeacher._id });

    res.cookie('token', token);
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingTeacher = await teacherModel.findOne({ email });

    if (!existingTeacher) {
      return res
        .status(400)
        .json({ error: ['Correo o contraseña incorrectos'] });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingTeacher.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: ['Correo o contraseña incorrectos'] });
    }

    const token = createAccessToken({ id: existingTeacher._id });

    res.cookie('token', token);

    res.status(200).json(existingTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const existingTeacher = await teacherModel.findById(req.user.id);
    if (!existingTeacher) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }

    res.status(200).json(existingTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const logoutTeacher = async (req, res) => {
  try {
    res.clearCookie('token', '', {
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Cerró sesión exitosamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.body;
  console.log(req.cookies);

  if (!token) {
    return res.status(401).json({ error: ['No autorizado'] });
  }

  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: ['No autorizado'] });
      }
      const existingTeacher = teacherModel.findById(decoded.id);
      if (!existingTeacher) {
        return res.status(404).json({ error: ['Usuario no encontrado'] });
      }
      res.status(200).json(decoded);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const generateToken = async (req, res) => {
  const { classId } = req.body;

  try {
    const existingTeacher = await teacherModel.findById(req.user.id);

    if (!existingTeacher) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }

    const token = await existingTeacher.generateToken(classId);

    existingTeacher.generatedTokens.push({
      token,
      class: classId,
      expiresOn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    await existingTeacher.save();

    return res
      .status(200)
      .json({ message: 'Token generado exitosamente', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export {
  registerTeacher,
  loginTeacher,
  getTeacherProfile,
  logoutTeacher,
  verifyToken,
  generateToken,
};
