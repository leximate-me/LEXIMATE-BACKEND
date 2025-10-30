import { FastifyInstance } from 'fastify';
import { AuthController } from '../auth.controller';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { RegisterAuthDto } from '../dtos/register-auth.dto';
import { LoginAuthDto } from '../dtos/login-auth.dto';
// Adapta estos middlewares a Fastify si aún no lo hiciste
import { authRequired } from '../../../common/middlewares/token.middleware';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { uploadToStorage } from '../../../common/middlewares/upload.middleware';

export async function authRouter(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post('/register', {
    preHandler: [validateDto(RegisterAuthDto)],
    handler: authController.register.bind(authController),
  });

  fastify.post('/login', {
    preHandler: [validateDto(LoginAuthDto)],
    handler: authController.login.bind(authController),
  });

  fastify.get('/verify-token', authController.verifyToken.bind(authController));

  fastify.post('/logout', {
    preHandler: [authRequired],
    handler: authController.logout.bind(authController),
  });

  fastify.get('/profile', {
    preHandler: [authRequired],
    handler: authController.getProfile.bind(authController),
  });

  fastify.delete('/delete', {
    preHandler: [authRequired, verifyUserRequired],
    handler: authController.delete.bind(authController),
  });

  fastify.post('/send-email-verification', {
    preHandler: [authRequired],
    handler: authController.sendEmailVerification.bind(authController),
  });

  fastify.get('/verify-email', {
    preHandler: [authRequired],
    handler: authController.verifyEmail.bind(authController),
  });

  fastify.put('/update-profile', {
    preHandler: [authRequired, uploadToStorage, verifyUserRequired],
    handler: authController.updateProfile.bind(authController),
  });
}
