import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { People, Role, User } from './entities';
import { DataSource, Repository } from 'typeorm';
import { Role as RoleEnum } from 'src/common/enums/role.enum';
import type { HashAdapter } from 'src/common/interfaces/hash.interface';
import { LoginUserDto } from './dto/login-user.dto';

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

    this.logger.log('Creando usuario...');

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
          { userName: createUserDto.user_name },
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
        firstName: createUserDto.first_name,
        lastName: createUserDto.last_name,
        dni: createUserDto.dni,
        institute: createUserDto.institute,
        phoneNumber: createUserDto.phone_number,
        birthDate: new Date(createUserDto.birth_date),
      });

      const savedPeople = await queryRunner.manager.save(People, people);

      const hashedPassword = await this.hashAdapter.hash(
        createUserDto.password,
      );

      const user = queryRunner.manager.create(User, {
        userName: createUserDto.user_name,
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

      this.logger.error('Error al crear usuario', error.message);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error interno al crear usuario');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
    } catch (error) {}
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
