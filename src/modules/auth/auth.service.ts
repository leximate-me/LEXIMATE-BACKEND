import jwt from 'jsonwebtoken';
import { createAccessToken } from '../../common/libs/jwt';
import { EnvConfiguration } from '../../common/configs/env.config';
import { resend } from '../../common/libs/resend';
import { AppDataSource } from '../../database/db';
import { User, People, Role, UserFile } from '../user/entities';
import { uploadImage } from '../../common/libs/cloudinary';
import { UserService } from '../user/user.service';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { HttpError } from '../../common/libs/http-error';
import { TokenPayload } from '../../common/interfaces/token-payload.interface';
import { BcryptAdapter } from '../../common/adapters/hash.adapter';
import { UpdateUserDto } from '../user/dtos/update-user.dto';

export class AuthService {
  private readonly userService: UserService = new UserService();
  private readonly fileUserRepository = AppDataSource.getRepository(UserFile);
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly bcryptAdapter = new BcryptAdapter();

  async registerUser(dto: RegisterAuthDto) {
    try {
      const defaultRole = await this.userService.findRoleByName('guest');

      // Crear persona
      const newPerson = await this.userService.createPerson({
        first_name: dto.first_name,
        last_name: dto.last_name,
        dni: dto.dni,
        institute: dto.institute,
        phone_number: dto.phone_number,
        birth_date: new Date(dto.birth_date),
      });

      // Hashear contraseña
      const hashedPassword = await this.bcryptAdapter.hash(dto.password);

      // Crear usuario
      const newUser = await this.userService.createUser(
        { ...dto, password: hashedPassword } as any,
        newPerson,
        defaultRole
      );

      // Generar avatar y subirlo
      const response = await fetch(
        `https://api.dicebear.com/9.x/notionists/svg?seed=${newUser.id},gestureProbability=50, beardProbability=30`
      );
      if (!response.ok) throw new Error('Error al generar el avatar');

      const avatarSvg = await response.text();
      const buffer = Buffer.from(avatarSvg, 'utf8');
      const uploadAvatar = await uploadImage(buffer);

      const uploadedAvatar = this.fileUserRepository.create({
        file_type: uploadAvatar.format,
        file_id: uploadAvatar.public_id,
        file_url: uploadAvatar.secure_url,
        user: newUser,
      });
      await this.fileUserRepository.save(uploadedAvatar);

      const token = await createAccessToken({
        id: newUser.id,
        rol: newUser.role.name,
        verify: newUser.verified,
      });

      return { newUser, token };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async loginUser(dto: LoginAuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw HttpError.unauthorized('crredenciales inválidas');

    const isValidPassword = await this.bcryptAdapter.compare(
      dto.password,
      user.password
    );
    if (!isValidPassword)
      throw HttpError.unauthorized('credenciales inválidass');

    const token = await createAccessToken({
      id: user.id,
      rol: user.role.name,
      verify: user.verified,
    });

    return { user, token };
  }

  async verifyToken(token: string) {
    if (!token) throw HttpError.unauthorized('Token no proporcionado');

    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

    const existingUser = await this.userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!existingUser) throw HttpError.notFound('Usuario no encontrado');

    return decoded;
  }

  async getProfileUser(userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const userAvatar = await this.fileUserRepository.findOne({
      where: { user: { id: foundUser.id } },
    });

    return {
      user: {
        id: foundUser.id,
        user_name: foundUser.user_name,
        email: foundUser.email,
        verified: foundUser.verified,
        role: foundUser.role,
        person: foundUser.people,
        avatar: userAvatar,
      },
    };
  }

  logoutUser() {
    return { message: 'Cerró sesión exitosamente' };
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw HttpError.notFound('Usuario no encontrado');

    await this.userRepository.softRemove(user);

    return { message: 'Usuario eliminado exitosamente' };
  }

  async sendEmailVerification(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw HttpError.notFound('Usuario no encontrado');

    const token = jwt.sign({ id: user.id }, EnvConfiguration().jwtSecret, {
      expiresIn: '1h',
    });

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
    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

    const user = await this.userRepository.findOne({
      where: { id: decoded.id },
    });
    if (!user) throw HttpError.notFound('Usuario no encontrado');

    user.verified = true;
    await this.userRepository.save(user);

    return { message: 'Correo electrónico verificado exitosamente' };
  }

  async updateProfileUser(
    userId: string,
    userData: Partial<UpdateUserDto>,
    imageProps?: any
  ) {
    const updatedUser = await this.userService.updateUser(userId, userData);

    if (imageProps?.fileUrl && imageProps?.fileId && imageProps?.fileType) {
      let userAvatar = await this.fileUserRepository.findOne({
        where: { user: { id: userId } },
      });
      if (userAvatar) {
        userAvatar.file_url = imageProps.fileUrl;
        userAvatar.file_id = imageProps.fileId;
        userAvatar.file_type = imageProps.fileType;
        await this.fileUserRepository.save(userAvatar);
      } else {
        userAvatar = this.fileUserRepository.create({
          user: updatedUser,
          file_url: imageProps.fileUrl,
          file_id: imageProps.fileId,
          file_type: imageProps.fileType,
        });
        await this.fileUserRepository.save(userAvatar);
      }
    }

    return updatedUser;
  }

  private handleDbException(error: any): never {
    if (error.code === '23505') {
      throw HttpError.badRequest(error.detail);
    }

    throw HttpError.internalServerError('Error en la base de datos');
  }
}
