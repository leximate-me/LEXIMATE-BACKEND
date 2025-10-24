import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../../common/libs/jwt';
import { JWT_SECRET } from '../../common/configs/env.config';
import { resend } from '../../common/libs/resend';
import { AppDataSource } from '../../database/db';
import { User, People, Role } from './entities';
import { TokenPayload } from 'src/common/types/express';
import { FileUser } from './entities/fileUser.entity';
import { uploadImage } from '../../common/libs/cloudinary';

interface RegisterUserData {
  first_name: string;
  last_name: string;
  dni: string;
  institute: string;
  phone_number: string;
  birth_date: Date;
  user_name: string;
  email: string;
  password: string;
  role: string;
  verified: boolean;
}

export class AuthService {
  async registerUser(userData: RegisterUserData) {
    const userRepo = AppDataSource.getRepository(User);
    const peopleRepo = AppDataSource.getRepository(People);
    const roleRepo = AppDataSource.getRepository(Role);
    const fileUserRepo = AppDataSource.getRepository(FileUser);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      const existingEmail = await userRepo.findOne({ where: { email } });
      const existingPerson = await peopleRepo.findOne({ where: { dni } });
      const existingUser = await userRepo.findOne({ where: { user_name } });
      const existingRole = await roleRepo.findOne({ where: { name: role } });

      if (existingEmail) throw new Error('El email ya está en uso');
      if (existingPerson) throw new Error('La persona ya existe');
      if (existingUser) throw new Error('El nombre de usuario ya existe');
      if (!existingRole) throw new Error('El rol no existe');

      const newPerson = peopleRepo.create({
        first_name,
        last_name,
        dni,
        institute,
        phone_number,
        birth_date,
      });
      await queryRunner.manager.save(newPerson);

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = userRepo.create({
        user_name,
        email,
        password: hashedPassword,
        people: newPerson,
        role: existingRole,
        verified: false,
      });
      await queryRunner.manager.save(newUser);

      const response = await fetch(
        `https://api.dicebear.com/9.x/notionists/svg?seed=${newUser.id},gestureProbability=50, beardProbability=30`
      );
      if (!response.ok) throw new Error('Error al generar el avatar');
      const avatarSvg = await response.text();
      const buffer = Buffer.from(avatarSvg, 'utf8');
      const uploadAvatar = await uploadImage(buffer);

      const uploadedAvatar = fileUserRepo.create({
        file_type: uploadAvatar.format,
        file_id: uploadAvatar.public_id,
        file_url: uploadAvatar.secure_url,
        user: newUser,
      });
      await queryRunner.manager.save(uploadedAvatar);

      if (!uploadedAvatar) throw new Error('Error al generar el avatar');

      const token = await createAccessToken({
        id: newUser.id,
        rol: existingRole.name,
        verify: newUser.verified,
      });

      await queryRunner.commitTransaction();

      return { newUser, token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async loginUser(userData: Partial<User>) {
    const userRepo = AppDataSource.getRepository(User);

    if (!userData) throw new Error('Datos no proporcionados');
    const { email, password } = userData;

    const existingUser = await userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!existingUser) throw new Error('No existe un usuario con ese email');

    const isValidPassword = await bcrypt.compare(
      password!,
      existingUser.password
    );
    if (!isValidPassword) throw new Error('Contraseña incorrecta');

    const token = await createAccessToken({
      id: existingUser.id,
      rol: existingUser.role.name,
      verify: existingUser.verified,
    });

    return { user: existingUser, token };
  }

  async verifyToken(token: string) {
    if (!token) throw new Error('Token no proporcionado');
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({ where: { id: decoded.id } });

    if (!existingUser) throw new Error('Usuario no encontrado');

    return decoded;
  }

  async getProfileUser(userId: string) {
    const userRepo = AppDataSource.getRepository(User);
    const fileUserRepo = AppDataSource.getRepository(FileUser);

    const foundUser = await userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'people'],
    });

    if (!foundUser) throw new Error('Usuario no encontrado');

    const userAvatar = await fileUserRepo.findOne({
      where: { user: { id: foundUser.id } },
    });

    return {
      user: {
        id: foundUser.id,
        user_name: foundUser.user_name,
        email: foundUser.email,
        verified: foundUser.verified,
        role: foundUser.role.id,
        person: {
          first_name: foundUser.people.first_name,
          last_name: foundUser.people.last_name,
          dni: foundUser.people.dni,
          institute: foundUser.people.institute,
          phone_number: foundUser.people.phone_number,
          birth_date: foundUser.people.birth_date,
        },
        avatar: userAvatar,
      },
    };
  }

  logoutUser() {
    return { message: 'Cerró sesión exitosamente' };
  }

  async deleteUser(userId: string) {
    const userRepo = AppDataSource.getRepository(User);
    const peopleRepo = AppDataSource.getRepository(People);

    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['people'],
    });
    if (!user) throw new Error('Usuario no encontrado');

    await userRepo.remove(user);
    await peopleRepo.remove(user.people);

    return { message: 'Usuario eliminado exitosamente' };
  }

  async sendEmailVerification(userId: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) throw new Error('Usuario no encontrado');

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    const { data, error } = await resend.emails.send({
      from: 'Leximate <no-reply@leximate.me>',
      to: [user.email],
      subject: 'Verificación de correo electrónico',
      html: `<strong>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</strong> <a href="http://localhost:8080/api/auth/verify-email?token=${token}">Verificar correo electrónico</a>`,
    });

    if (error) throw new Error(`Error al enviar el correo: ${error.message}`);

    return data;
  }

  async verifyEmail(token: string) {
    if (!token) throw new Error('Token no proporcionado');
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!decoded) throw new Error('Token inválido');

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: decoded.id } });
    if (!user) throw new Error('Usuario no encontrado');

    user.verified = true;
    await userRepo.save(user);

    return { message: 'Correo electrónico verificado exitosamente' };
  }

  async updateProfileUser(
    userId: string,
    userData: Partial<RegisterUserData>,
    imageProps?: any
  ) {
    const userRepo = AppDataSource.getRepository(User);
    const peopleRepo = AppDataSource.getRepository(People);
    const fileUserRepo = AppDataSource.getRepository(FileUser);

    const foundUser = await userRepo.findOne({
      where: { id: userId },
      relations: ['people'],
    });
    if (!foundUser) throw new Error('Usuario no encontrado');

    const existingPerson = foundUser.people;
    if (!existingPerson) throw new Error('Persona no encontrada');

    // Actualiza usuario
    if (userData.user_name) foundUser.user_name = userData.user_name;
    if (userData.email) foundUser.email = userData.email;
    await userRepo.save(foundUser);

    // Actualiza persona
    if (userData.first_name) existingPerson.first_name = userData.first_name;
    if (userData.last_name) existingPerson.last_name = userData.last_name;
    if (userData.dni) existingPerson.dni = userData.dni;
    if (userData.institute) existingPerson.institute = userData.institute;
    if (userData.phone_number)
      existingPerson.phone_number = userData.phone_number;
    if (userData.birth_date) existingPerson.birth_date = userData.birth_date;
    await peopleRepo.save(existingPerson);

    // Actualiza avatar
    if (imageProps?.fileUrl && imageProps?.fileId && imageProps?.fileType) {
      let userAvatar = await fileUserRepo.findOne({
        where: { user: { id: foundUser.id } },
      });
      if (userAvatar) {
        userAvatar.file_url = imageProps.fileUrl;
        userAvatar.file_id = imageProps.fileId;
        userAvatar.file_type = imageProps.fileType;
        await fileUserRepo.save(userAvatar);
      } else {
        userAvatar = fileUserRepo.create({
          user: foundUser,
          file_url: imageProps.fileUrl,
          file_id: imageProps.fileId,
          file_type: imageProps.fileType,
        });
        await fileUserRepo.save(userAvatar);
      }
    }

    return { updatedUser: foundUser, updatedPerson: existingPerson };
  }

  async seedRoles() {
    const roleRepo = AppDataSource.getRepository(Role);

    const roles = ['admin', 'teacher', 'student'];
    for (const roleName of roles) {
      const existingRole = await roleRepo.findOne({
        where: { name: roleName },
      });
      if (!existingRole) {
        const newRole = roleRepo.create({
          name: roleName,
          description: `Rol ${roleName}`, // <--- descripción obligatoria
        });
        await roleRepo.save(newRole);
      }
    }
  }
}
