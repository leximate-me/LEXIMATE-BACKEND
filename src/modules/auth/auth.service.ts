import jwt from 'jsonwebtoken';
import { createAccessToken } from '../../common/libs/jwt';
import { EnvConfiguration } from '../../common/configs/env.config';
import { resend } from '../../common/libs/resend';
import { AppDataSource } from '../../database/db';
import { User, People, Role, FileUser } from '../user/entities';
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
  private readonly fileUserRepository = AppDataSource.getRepository(FileUser);
  private readonly bcryptAdapter = new BcryptAdapter();

  async registerUser(dto: RegisterAuthDto) {
    // Validaciones de existencia
    // const existingEmail = await this.userService.findByEmail(dto.email);
    // if (existingEmail) throw new Error('El email ya está en uso');

    // const existingPerson = await this.userService.findPersonByDni(dto.dni);
    // if (existingPerson) throw new Error('La persona ya existe');

    // const existingUser = await this.userService.findByUserName(dto.user_name);
    // if (existingUser) throw new Error('El nombre de usuario ya existe');

    const existingRole = await this.userService.findRoleByName(dto.role);
    if (!existingRole) throw new Error('El rol no existe');

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
      existingRole
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

    // Generar token
    const token = await createAccessToken({
      id: newUser.id,
      rol: existingRole.name,
      verify: newUser.verified,
    });

    return { newUser, token };
  }

  async loginUser(dto: LoginAuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new HttpError(404, 'No existe un usuario con ese email');

    const isValidPassword = await this.bcryptAdapter.compare(
      dto.password,
      user.password
    );
    if (!isValidPassword) throw new HttpError(401, 'Contraseña incorrecta');

    const token = await createAccessToken({
      id: user.id,
      rol: user.role.name,
      verify: user.verified,
    });

    return { user, token };
  }

  async verifyToken(token: string) {
    if (!token) throw new Error('Token no proporcionado');
    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

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

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: decoded.id } });
    if (!user) throw new Error('Usuario no encontrado');

    user.verified = true;
    await userRepo.save(user);

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
}
