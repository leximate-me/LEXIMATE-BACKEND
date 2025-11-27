import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterAuthDto, LoginAuthDto, VerifyUserDto } from '@auth/dtos';
import { AuthService } from '@auth/services/auth.service';
import { HttpError } from '@common/libs/http-error';
import { RoleEnum } from '@common/enums/role.enum';

export class AuthController {
  private authService: AuthService = new AuthService();

  async register(
    request: FastifyRequest<{ Body: RegisterAuthDto }>,
    reply: FastifyReply
  ) {
    const { newUser, token } = await this.authService.registerUser(
      request.body
    );

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      })
      .code(201)
      .send({ newUser, token });
  }

  async login(
    request: FastifyRequest<{ Body: LoginAuthDto }>,
    reply: FastifyReply
  ) {
    const { user, token } = await this.authService.loginUser(request.body);

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      })
      .code(200)
      .send({ user, token });
  }

  async verifyToken(request: FastifyRequest, reply: FastifyReply) {
    const token =
      request.cookies?.token || request.headers.authorization?.split(' ')[1];

    const decoded = await this.authService.verifyToken(token);

    reply.code(200).send(decoded);
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id;

    const existingUser = await this.authService.getProfileUser(userId);

    reply.code(200).send(existingUser);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id;

    const response = await this.authService.deleteUser(userId);

    reply
      .setCookie('token', '', { expires: new Date(0) })
      .code(200)
      .send(response);
  }

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    const response = this.authService.logoutUser();

    reply.clearCookie('token', { path: '/' }).code(200).send(response);
  }

  async sendEmailVerification(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id;

    const response = await this.authService.sendEmailVerification(userId);

    reply.code(200).send(response);
  }

  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    const token = (request.query as any).token as string;

    const response = await this.authService.verifyEmail(token);

    reply.redirect(`${process.env.FRONTEND_URL}`);
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id;
    const userData = request.body;

    let fileUrl, fileId, fileType;

    const file = (request as any).file || (request as any).files?.[0];
    if (file && file.cloudinaryUrl) {
      fileUrl = file.cloudinaryUrl;
      fileId = file.cloudinaryPublicId;
      fileType = file.mimetype;
    }

    const imageProps = {
      fileUrl: fileUrl || '',
      fileId: fileId || '',
      fileType: fileType || '',
    };

    const updatedUser = await this.authService.updateProfileUser(
      userId,
      userData,
      imageProps
    );

    reply.code(200).send(updatedUser);
  }

  async verifyUser(
    request: FastifyRequest<{ Body: VerifyUserDto }>,
    reply: FastifyReply
  ) {
    const { userId, roleName } = request.body;
    const userRole = request.user.rol

    if (userRole !== RoleEnum.ADMIN) {
      throw HttpError.forbidden('Requires administrator privileges');
    }

    const updatedUser = await this.authService.verifyUser(userId, roleName);

    reply.code(200).send(updatedUser);
  }

  async getUnverifiedUsers(request: FastifyRequest, reply: FastifyReply) {
    const userRole = (request.user as any)?.rol;

    if (userRole !== RoleEnum.ADMIN) {
      throw HttpError.forbidden('Requires administrator privileges');
    }

    const unverifiedUsers = await this.authService.getUnverifiedUsers();

    reply.code(200).send(unverifiedUsers);
  }
}
