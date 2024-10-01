import { User } from '../models/user.model.js';
import { People } from '../models/people.model.js';
import { Role } from '../models/roles.model.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';
import { resend } from '../libs/resend.js';

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
  const existingRole = await Role.findOne({ where: { name: role } });
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
    roles_fk: existingRole.id,
  });

  // Crear el token de acceso
  const token = await createAccessToken({
    id: newUser.id,
    rol: existingRole.id,
  });

  return { newUser, token };
};

const loginUserService = async (userData) => {
  const { email, password } = userData;

  // Verificar si el usuario existe
  const existing = await User.findOne({ where: { email } });

  if (!existing) {
    throw new Error('No existe un usuario con ese email');
  }

  // Verificar si la contraseña es correcta
  const isValidPassword = await bcrypt.compare(password, existing.password);
  if (!isValidPassword) {
    throw new Error('Contraseña incorrecta');
  }

  // Verificar si el usuario tiene un rol asignado
  const role = existing.roles_fk;

  if (!role) {
    throw new Error('El usuario no tiene un rol asignado');
  }

  // Crear el token de acceso
  const token = await createAccessToken({
    id: existing.id,
    rol: role,
  });

  return { user: existing, token };
};

const verifyTokenService = async (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Buscar el usuario
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

const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  await user.destroy();
  return { message: 'Usuario eliminado exitosamente' };
};

const sendEmailVerificationService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: '1d',
  });

  const { data, error } = await resend.emails.send({
    from: 'Leximate <no-reply@leximate.me>', // Usa tu dominio personalizado
    to: [user.email],
    subject: 'Verificación de correo electrónico',
    html: `<strong>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</strong> <a href="http://localhost:8080/api/auth/verify-email?token=${token}">Verificar correo electrónico</a>`,
  });

  if (error) {
    throw new Error(`Error al enviar el correo: ${error.message}`);
  }

  return data;
};

const verifyEmailService = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.verified = true;
    await user.save();
    return { message: 'Email verificado exitosamente' };
  } catch (error) {
    throw new Error('Token no válido');
  }
};

export {
  loginUserService,
  verifyTokenService,
  getProfileUserService,
  logoutUserService,
  registerUserService,
  deleteUserService,
  sendEmailVerificationService,
  verifyEmailService,
};
