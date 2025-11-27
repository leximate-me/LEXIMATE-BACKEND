import { FastifyInstance } from 'fastify';
import { AuthController } from '@auth/controllers/auth.controller';
import { authRequired } from '@common/middlewares/token.middleware';
import { verifyUserRequired } from '@common/middlewares/user.middleware';
import { uploadToStorage } from '@common/middlewares/upload.middleware';
import { registerAuthSchema } from '@auth/schemas/register-auth.schema';
import { loginAuthSchema } from '@auth/schemas/login-auth.schema';
import { requireRole } from '@common/middlewares';
import { RoleEnum } from '@common/enums/role.enum';

export async function authRouter(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post('/register', {
    schema: registerAuthSchema,
    handler: authController.register.bind(authController),
  });

  fastify.post('/login', {
    schema: loginAuthSchema,
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

  fastify.post('/verify-user', {
    preHandler: [authRequired, requireRole(RoleEnum.ADMIN)],
    handler: authController.verifyUser.bind(authController),
  });

  fastify.get('/unverified-users', {
    preHandler: [authRequired, requireRole(RoleEnum.ADMIN)],
    handler: authController.getUnverifiedUsers.bind(authController),
  });
}
