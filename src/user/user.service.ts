import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
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

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

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
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al iniciar sesión');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, userName, password } = loginUserDto;
    try {
      const foundUser = await this.userRepository.findOne({
        where: [{ email }, { userName }],
        select: ['id', 'userName', 'email', 'password', 'role', 'people'],
        relations: ['role', 'people'],
      });

      if (
        !foundUser ||
        !this.hashAdapter.compare(password, foundUser.password)
      ) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const { password: userPassword, ...userWithoutPassword } = foundUser;

      //TODO retornar un token JWT

      return userWithoutPassword;
    } catch (error) {
      this.logger.error('Error al iniciar sesión', error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al iniciar sesión');
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
}
