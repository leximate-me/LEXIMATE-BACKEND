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
        password: hashedPassword,
        role,
      });
      const savedUser = await newUser.save();
      const token = await createAccessToken({ id: savedUser._id });
      res.coookie('token', token);
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
