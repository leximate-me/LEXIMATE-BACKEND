import { AppDataSource } from '../../database/db';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { People } from '../user/entities/people.entity';
import { Permission } from '../user/entities/permission.entity';
import { Course } from '../course/entities/course.entity';
import { Post } from '../post/entities/post.entity';
import { Task } from '../task/entities/task.entity';
import { FileUser } from '../user/entities';
import { FileTask } from '../task/entities/fileTask.entity';
import { Comment } from '../comment/entities/comment.entity';
import { BcryptAdapter } from '../../common/adapters/hash.adapter';
import { Not, IsNull } from 'typeorm';

export class SeedService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly roleRepository = AppDataSource.getRepository(Role);
  private readonly peopleRepository = AppDataSource.getRepository(People);
  private readonly permissionRepository =
    AppDataSource.getRepository(Permission);
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly postRepository = AppDataSource.getRepository(Post);
  private readonly commentRepository = AppDataSource.getRepository(Comment);
  private readonly taskRepository = AppDataSource.getRepository(Task);
  private readonly fileUserRepository = AppDataSource.getRepository(FileUser);
  private readonly fileTaskRepository = AppDataSource.getRepository(FileTask);
  private readonly bcryptAdapter = new BcryptAdapter();

  async seedAll() {
    await this.fileTaskRepository.delete({ id: Not(IsNull()) });
    await this.fileUserRepository.delete({ id: Not(IsNull()) });
    await this.commentRepository.delete({ id: Not(IsNull()) });
    await this.postRepository.delete({ id: Not(IsNull()) });
    await this.taskRepository.delete({ id: Not(IsNull()) });
    await this.courseRepository.delete({ id: Not(IsNull()) });
    await this.userRepository.delete({ id: Not(IsNull()) });
    await this.peopleRepository.delete({ id: Not(IsNull()) });
    await this.roleRepository.delete({ id: Not(IsNull()) });
    await this.permissionRepository.delete({ id: Not(IsNull()) });
    // 1. Permisos
    const permissionsData = [
      { name: 'manage_users', description: 'Gestionar usuarios' },
      { name: 'manage_courses', description: 'Gestionar cursos' },
      { name: 'manage_posts', description: 'Gestionar posts' },
      { name: 'manage_comments', description: 'Gestionar comentarios' },
      { name: 'view_content', description: 'Ver contenido' },
    ];
    const permissions: Permission[] = [];
    for (const perm of permissionsData) {
      let permission = await this.permissionRepository.findOne({
        where: { name: perm.name },
      });
      if (!permission) {
        permission = this.permissionRepository.create(perm);
        await this.permissionRepository.save(permission);
      }
      permissions.push(permission);
    }

    // 2. Roles
    const rolesData = [
      { name: 'admin', description: 'Administrador', permissions },
      {
        name: 'teacher',
        description: 'Profesor',
        permissions: permissions.filter((p) => p.name !== 'manage_users'),
      },
      {
        name: 'student',
        description: 'Estudiante',
        permissions: permissions.filter((p) => p.name === 'view_content'),
      },
      {
        name: 'guest',
        description: 'Invitado',
        permissions: permissions.filter((p) => p.name === 'view_content'),
      },
    ];
    const roles: Role[] = [];
    for (const roleData of rolesData) {
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });
      if (!role) {
        role = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
        });
        await this.roleRepository.save(role);
      }
      roles.push(role);
    }

    // 3. Usuarios
    const usersData = [
      {
        user_name: 'admin',
        email: 'admin@example.com',
        password: await this.bcryptAdapter.hash('Admin_123'),
        first_name: 'Admin',
        last_name: 'User',
        dni: '10000001',
        institute: 'Main',
        phone_number: '1111111111',
        birth_date: new Date('1990-01-01'),
        role: roles.find((r) => r.name === 'admin'),
      },
      {
        user_name: 'teacher',
        email: 'teacher@example.com',
        password: await this.bcryptAdapter.hash('Teacher_123'),
        first_name: 'Teacher',
        last_name: 'User',
        dni: '10000002',
        institute: 'Main',
        phone_number: '2222222222',
        birth_date: new Date('1991-01-01'),
        role: roles.find((r) => r.name === 'teacher'),
      },
      {
        user_name: 'student',
        email: 'student@example.com',
        password: await this.bcryptAdapter.hash('Student_123'),
        first_name: 'Student',
        last_name: 'User',
        dni: '10000003',
        institute: 'Main',
        phone_number: '3333333333',
        birth_date: new Date('1992-01-01'),
        role: roles.find((r) => r.name === 'student'),
      },
      {
        user_name: 'guest',
        email: 'guest@example.com',
        password: await this.bcryptAdapter.hash('Guest_123'),
        first_name: 'Guest',
        last_name: 'User',
        dni: '10000004',
        institute: 'Main',
        phone_number: '4444444444',
        birth_date: new Date('1993-01-01'),
        role: roles.find((r) => r.name === 'guest'),
      },
    ];

    for (const userData of usersData) {
      let person = await this.peopleRepository.findOne({
        where: { dni: userData.dni },
      });
      if (!person) {
        person = this.peopleRepository.create({
          first_name: userData.first_name,
          last_name: userData.last_name,
          dni: userData.dni,
          institute: userData.institute,
          phone_number: userData.phone_number,
          birth_date: userData.birth_date,
        });
        await this.peopleRepository.save(person);
      }

      let user = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (!user) {
        user = this.userRepository.create({
          user_name: userData.user_name,
          email: userData.email,
          password: userData.password,
          verified: true,
          people: person,
          role: userData.role,
        });
        await this.userRepository.save(user);
      }
    }

    return { message: 'Seed completado' };
  }
}
