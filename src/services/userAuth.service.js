import { User } from '../models/user.model.js';
import { Role } from '../models/roles.model.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';

const registerUserService = async (userData) => {
  const {
    role,
    first_name,
    last_name,
    dni,
    email,
    institute,
    phone_number,
    birth_date,
    password,
  } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El correo ya está registrado');
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buscar el rol en la base de datos
  const roleRecord = await Role.findOne({ where: { name: role } });
  if (!roleRecord) {
    throw new Error('Rol no válido');
  }

  // Crear el nuevo usuario
  let newUser;
  if (role === 'Teacher') {
    newUser = await User.create({
      first_name,
      last_name,
      dni,
      email,
      institute,
      phone_number,
      birth_date,
      password: hashedPassword,
      role_fk: roleRecord.id,
    });
  } else if (role === 'Student') {
    newUser = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      birth_date,
      password: hashedPassword,
      role_fk: roleRecord.id,
    });
  } else {
    throw new Error('Rol no válido');
  }

  // Crear el token de acceso
  const token = await createAccessToken({ id: newUser.id, role });

  // Devolver el nuevo usuario y el token
  return { newUser, token };
};

const loginUserService = async (userData) => {
  const { email, password } = userData;
  let user = null;
  let userType = null;

  // Verificar si el usuario existe
  user = await User.findOne({ where: { email } });
  console.log(user);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar la contraseña
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Contraseña incorrecta');
  }

  // Obtener el rol del usuario
  const role = await Role.findByPk(user.role_fk);

  // Crear el token de acceso
  const token = await createAccessToken({ id: user.id, role: role.name });

  return { user, token };
};

const verifyTokenService = async (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const existingUser = await User.findByPk(decoded.id);

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    return { decoded, existingUser };
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

const getProfileUserService = async (userId) => {
  let existingUser = null;

  existingUser = await User.findByPk(userId);

  if (!existingUser) {
    throw new Error('Usuario no encontrado');
  }

  return existingUser;
};

const logoutUserService = () => {
  return { message: 'Cerró sesión exitosamente' };
};

export {
  loginUserService,
  verifyTokenService,
  getProfileUserService,
  logoutUserService,
  registerUserService,
};
