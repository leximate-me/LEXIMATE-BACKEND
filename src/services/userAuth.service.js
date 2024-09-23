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

  user = await teacherModel.findOne({ email });
  userType = 'teacher';
  console.log(user);
  if (!user) {
    user = await studentModel.findOne({ email });
    userType = 'student';

    if (user.expiresAt < new Date()) {
      const deleteStudent = await studentModel.findByIdAndDelete({
        _id: user._id,
      });
      res.json({ error: ['El token de acceso ha expirado'] });
      return deleteStudent;
    }
  }

  if (!user) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const token = await createAccessToken({ id: user._id, userType });
  console.log(user);
  return { user, token };
};

const verifyTokenService = async (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
  }
  let existingUser = null;

  const decoded = jwt.verify(token, JWT_SECRET);
  existingUser = await studentModel.findById(decoded.id);

  if (!existingUser) {
    existingUser = await teacherModel.findById(decoded.id);
  }

  if (!existingUser) {
    throw new Error('Usuario no encontrado');
  }
  return { decoded, existingUser };
};

const getProfileUserService = async (userId) => {
  let existingUser = null;

  existingUser = await studentModel.findById(userId);

  if (!existingUser) {
    existingUser = await teacherModel.findById(userId);
  }

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
