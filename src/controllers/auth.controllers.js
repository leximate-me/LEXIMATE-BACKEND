import bcrypt from 'bcryptjs';
import { userModel } from '../models/user.model.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';

const register = async (req, res) => {
  const { name, lastname, gender, birthdate, country, email, password, role } =
    req.body;
  try {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ error: ['El usuario ya existe'] });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: ['Error en el servidor'] });
      }
      const newUser = new userModel({
        name,
        lastname,
        gender,
        birthdate,
        country,
        email,
        password: hash,
        role,
      });
      const savedUser = await newUser.save();
      const token = await createAccessToken({ id: savedUser._id });
      res.cookie('token', token);
      res.status(201).json({
        id: savedUser._id,
        name: savedUser.name,
        lastname: savedUser.lastname,
        gender: savedUser.gender,
        birthdate: savedUser.birthdate,
        country: savedUser.country,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await userModel.findOne({ email });
    if (!userFound) {
      return res
        .status(400)
        .json({ error: ['Usuario o contraseña incorrectos'] });
    }
    const validPassword = await bcrypt.compare(password, userFound.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ error: ['Usuario o contraseña incorrectos'] });
    }
    const token = await createAccessToken({ id: userFound._id });
    res.cookie('token', token);
    res.status(200).json({
      id: userFound._id,
      name: userFound.name,
      lastname: userFound.lastname,
      gender: userFound.gender,
      birthdate: userFound.birthdate,
      country: userFound.country,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
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
    const userFound = await userModel.findById(req.user.id);
    if (!userFound) {
      return res.status(404).json({ error: ['Usuario no encontrado'] });
    }
    res.status(200).json({
      id: userFound._id,
      name: userFound.name,
      lastname: userFound.lastname,
      gender: userFound.gender,
      birthdate: userFound.birthdate,
      country: userFound.country,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: ['No autorizado'] });
  }
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({ error: ['No autorizado'] });
      }
      const userFound = await userModel.findById(user.id);
      if (!userFound) {
        return res.status(404).json({ error: ['Usuario no encontrado'] });
      }
      return res.status(200).json({
        id: userFound._id,
        name: userFound.name,
        lastname: userFound,
        gender: userFound.gender,
        birthdate: userFound.birthdate,
        country: userFound.country,
        email: userFound.email,
        role: userFound.role,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { register, login, logout, profile, verifyToken };
