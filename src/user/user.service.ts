import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { People } from './entities/people.entity';
import { Role } from './entities/role.entity';
import { Role as RoleEnum } from 'src/common/enums/role.enum';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private dataSource: DataSource,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const people = queryRunner.manager.create(People, {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        dni: createUserDto.dni,
        institute: createUserDto.institute,
        phoneNumber: createUserDto.phoneNumber,
        birthDate: new Date(createUserDto.birthDate),
      });
      await queryRunner.manager.save(people);

      const role = await queryRunner.manager.findOneOrFail(Role, {
        where: { name: createUserDto.role || RoleEnum.GUEST },
      });

      // Crear usuario
      const user = queryRunner.manager.create(User, {
        userName: createUserDto.userName,
        email: createUserDto.email,
        password: createUserDto.password, // El hash lo hace AuthService
        people,
        role: role,
      });

      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.userRepository.find({ relations: ['people', 'role'] });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'userName', 'email', 'password', 'role'],
      relations: ['role'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
