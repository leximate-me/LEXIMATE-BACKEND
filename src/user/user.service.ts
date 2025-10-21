import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { People, Role, User } from './entities';
import { Role as RoleEnum } from 'src/common/enums/role.enum';
import type { HashAdapter } from 'src/common/interfaces/hash.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    private dataSource: DataSource,
    @Inject('HashAdapter')
    private readonly hashAdapter: HashAdapter,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roleToFind = createUserDto.role || RoleEnum.GUEST;

      const role = await queryRunner.manager.findOne(Role, {
        where: { name: roleToFind as RoleEnum },
      });

      if (!role) {
        throw new BadRequestException(`Rol '${roleToFind}' no encontrado`);
      }

      const existingUser = await queryRunner.manager.findOne(User, {
        where: [
          { email: createUserDto.email },
          { userName: createUserDto.userName },
        ],
      });

      if (existingUser) {
        throw new BadRequestException(
          'Usuario con este email o username ya existe',
        );
      }

      const existingPeople = await queryRunner.manager.findOne(People, {
        where: { dni: createUserDto.dni },
      });

      if (existingPeople) {
        throw new BadRequestException('Usuario con este DNI ya existe');
      }

      const people = queryRunner.manager.create(People, {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        dni: createUserDto.dni,
        institute: createUserDto.institute,
        phoneNumber: createUserDto.phoneNumber,
        birthDate: new Date(createUserDto.birthDate),
      });

      const savedPeople = await queryRunner.manager.save(People, people);

      const hashedPassword = await this.hashAdapter.hash(
        createUserDto.password,
      );

      const user = queryRunner.manager.create(User, {
        userName: createUserDto.userName,
        email: createUserDto.email,
        password: hashedPassword,
        role: role,
        people: savedPeople,
      });

      const savedUser = await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      await queryRunner.release();

      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;
    } catch (error) {
      return this.handleError(
        error,
        queryRunner,
        'registro de usuario',
        'Error interno al registrar usuario',
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, userName, password } = loginUserDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: [{ email }, { userName }],
        select: ['id', 'userName', 'email', 'password', 'role', 'people'],
        relations: ['role', 'people'],
      });

      this.logger.debug(user);

      const comparePassword = await this.hashAdapter.compare(
        password,
        user?.password || '',
      );

      if (!user || !comparePassword) {
        throw new BadRequestException('Credenciales inválidas');
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return user;
    } catch (error) {
      return this.handleError(
        error,
        queryRunner,
        'inicio de sesión de usuario',
        'Error interno en el inicio de sesión del usuario',
      );
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async seedRoles() {
    const roles = [
      RoleEnum.ADMIN,
      RoleEnum.TEACHER,
      RoleEnum.STUDENT,
      RoleEnum.GUEST,
    ];
    for (const roleName of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!existingRole) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
      }
    }

    return 'Roles seeded';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async handleError(
    error: any,
    queryRunner: QueryRunner,
    context: string,
    defaultMessage = 'Error interno del servidor',
  ): Promise<never> {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }

    this.logger.error(`Error en ${context}:`, error.message);

    if (
      error instanceof BadRequestException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }

    throw new InternalServerErrorException(defaultMessage);
  }

  private async cleanupQueryRunner(queryRunner: QueryRunner): Promise<void> {
    try {
      if (queryRunner.isTransactionActive) {
        await queryRunner.commitTransaction();
      }
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
