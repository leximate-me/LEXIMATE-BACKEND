import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../libs/jwt.js';
import { JWT_SECRET } from '../configs/envConfig.js';
import { resend } from '../libs/resend.js';
import { sequelize } from '../database/db.js';
import { User } from '../models/user.model.js';
import { People } from '../models/people.model.js';
import { Role } from '../models/roles.model.js';

const registerUserService = async (userData) => {
  // Iniciar una transacción de la base de datos
  const transaction = await sequelize.transaction();
  try {
    if (!userData) {
      throw new Error('Datos no proporcionados');
    }

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
    const existingEmail = await User.findOne(
      { where: { email } },
      { transaction }
    );
    if (existingEmail) {
      throw new Error('El usuario ya existe');
    }

    // Verificar si la persona ya existe
    const existingPerson = await People.findOne(
      { where: { dni } },
      { transaction }
    );
    if (existingPerson) {
      throw new Error('La persona ya existe');
    }

    // Verificar si el nombre de usuario ya existe
    const existingUser = await User.findOne(
      { where: { user_name } },
      { transaction }
    );
    if (existingUser) {
      throw new Error('El nombre de usuario ya existe');
    }

    // Verificar si el rol existe
    const existingRole = await Role.findOne(
      { where: { name: role } },
      { transaction }
    );
    if (!existingRole) {
      throw new Error('El rol no existe');
    }

    // Crear la persona
    const newPerson = await People.create(
      {
        first_name,
        last_name,
        dni,
        institute,
        phone_number,
        birth_date,
      },
      { transaction }
    );

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const newUser = await User.create(
      {
        user_name,
        email,
        password: hashedPassword,
        people_fk: newPerson.id,
        roles_fk: existingRole.id,
      },
      { transaction }
    );

    // Crear el token de acceso
    const token = await createAccessToken({
      id: newUser.id,
      rol: existingRole.id,
      verify: newUser.verified,
    });

    await transaction.commit();

    return { newUser, token };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const loginUserService = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    if (!userData) {
      throw new Error('Datos no proporcionados');
    }

    const { email, password } = userData;

    // Verificar si el usuario existe
    const existingUser = await User.findOne(
      { where: { email } },
      { transaction }
    );

    if (!existingUser) {
      throw new Error('No existe un usuario con ese email');
    }

    // Verificar si la contraseña es correcta
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta');
    }

    // Verificar si el usuario tiene un rol asignado
    const existingRole = await Role.findByPk(existingUser.roles_fk, {
      transaction,
    });

    if (!existingRole) {
      throw new Error('El usuario no tiene un rol asignado');
    }

    // Crear el token de acceso
    const token = await createAccessToken({
      id: existingUser.id,
      rol: existingRole.id,
      verify: existingUser.verified,
    });

    await transaction.commit();

    return { user: existingUser, token };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const verifyTokenService = async (token) => {
  const transaction = await sequelize.transaction();

  try {
    if (!token) {
      throw new Error('Token no proporcionado');
    }
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Buscar el usuario
    const existingUser = await User.findByPk(decoded.id, { transaction });

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    await transaction.commit();

    return { decoded, existingUser };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getProfileUserService = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    if (!userId) {
      throw new Error('Usuario no proporcionado');
    }
    const existingUser = await User.findByPk(userId, { transaction });

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    await transaction.commit();

    return existingUser;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const logoutUserService = () => {
  return { message: 'Cerró sesión exitosamente' };
};

const deleteUserService = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    if (!id) {
      throw new Error('Usuario no proporcionado');
    }
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const person = await People.findByPk(user.people_fk, { transaction });

    if (!person) {
      throw new Error('Persona no encontrada');
    }

    await transaction.commit();

    await user.destroy();
    await person.destroy();
    return { message: 'Usuario eliminado exitosamente' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const sendEmailVerificationService = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    if (!id) {
      throw new Error('Usuario no proporcionado');
    }
    const user = await User.findByPk(id, { transaction });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    const { data, error } = await resend.emails.send({
      from: 'Leximate <no-reply@leximate.me>',
      to: [user.email],
      subject: 'Verificación de correo electrónico',
      html: `<strong>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</strong> <a href="http://localhost:8080/api/auth/verify-email?token=${token}">Verificar correo electrónico</a>`,
    });

    if (error) {
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }

    await transaction.commit();

    return data;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const verifyEmailService = async (token) => {
  const transaction = await sequelize.transaction();

  try {
    if (!token) {
      throw new Error('Token no proporcionado');
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, { transaction });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.verified = true;
    await user.save({ transaction });

    await transaction.commit();

    return { message: 'Correo electrónico verificado exitosamente' };
  } catch (error) {
    await transaction.rollback();
    throw error;
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
