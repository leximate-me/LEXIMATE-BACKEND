import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';

export class AuthController {
  private authService: AuthService = new AuthService();

  async register(
    request: FastifyRequest<{ Body: RegisterAuthDto }>,
    reply: FastifyReply
  ) {
    try {
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
    } catch (error) {
      reply.code(500).send({ message: (error as Error).message });
    }
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
    console.log('este es el token del controlador verify token', token);
    reply.log.info(token);

    const decoded = await this.authService.verifyToken(token);

    reply.log.info(decoded, 'Token verificado');

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

    // Si usas @fastify/multipart, adapta la obtención del archivo aquí
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
}
