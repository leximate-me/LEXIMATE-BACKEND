import { User } from '../models/user.model.js';
import { People } from '../models/people.model.js';
import { Role } from '../models/roles.model.js';
import { RoleUser } from '../models/rolesUsers.model.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';

const registerUserService = async (userData) => {
  const {
    first_name,
    last_name,
    dni,
    institute,
    phone_number,
    birth_date,
    user_name,
    email,
    password,
    role,
  } = userData;

  // Verificar si el usuario ya existe
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('El usuario ya existe');
  }

  // Verificar si la persona ya existe
  const existingPerson = await People.findOne({ where: { dni } });
  if (existingPerson) {
    throw new Error('La persona ya existe');
  }

  // Verificar si el nombre de usuario ya existe
  const existingUser = await User.findOne({ where: { user_name } });
  if (existingUser) {
    throw new Error('El nombre de usuario ya existe');
  }

  // Verificar si el rol existe
  const existingRole = await Role.findByPk(role);
  if (!existingRole) {
    throw new Error('El rol no existe');
  }

  // Crear la persona
  const newPerson = await People.create({
    first_name,
    last_name,
    dni,
    institute,
    phone_number,
    birth_date,
  });

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 12);

  // Crear el usuario
  const newUser = await User.create({
    user_name,
    email,
    password: hashedPassword,
    people_fk: newPerson.id,
  });

  // Asignar el rol al usuario
  await RoleUser.create({
    users_fk: newUser.id,
    roles_fk: role,
  });

  // Crear el token de acceso
  const token = await createAccessToken({
    id: newUser.id,
    rol: existingRole.name,
  });

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
