import { In } from 'typeorm';
import { HttpError } from '@common/libs/http-error';
import { AppDataSource } from '@database/db';
import { User, People, Role } from '@user/entities';
import { CreateUserDto, UpdateUserDto } from '@user/dtos';
import { RoleEnum } from '@common/enums/role.enum';

export class UserService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly peopleRepository = AppDataSource.getRepository(People);
  private readonly roleRepository = AppDataSource.getRepository(Role);

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role', 'people'],
    });
  }

  async findByUserName(user_name: string) {
    return this.userRepository.findOne({ where: { user_name } });
  }

  async findPersonByDni(dni: string) {
    return this.peopleRepository.findOne({ where: { dni } });
  }

  async findRoleByName(role: RoleEnum) {
    return this.roleRepository.findOne({ where: { name: role } });
  }

  async createUser(createUserDto: CreateUserDto, people: People, role: Role) {
    const user = this.userRepository.create({
      ...createUserDto,
      people,
      role,
      verified: false,
    });
    return this.userRepository.save(user);
  }

  async createPerson(data: Partial<People>) {
    const person = this.peopleRepository.create(data);
    return this.peopleRepository.save(person);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['people', 'role'],
    });
    if (!user) throw new HttpError(404, 'Usuario no encontrado');

    if (updateUserDto.user_name) user.user_name = updateUserDto.user_name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;
    if (updateUserDto.role) {
      const role = await this.roleRepository.findOne({
        where: { name: updateUserDto.role as RoleEnum },
      });
      if (role) user.role = role;
    }

    if (user.people) {
      if (updateUserDto.first_name)
        user.people.first_name = updateUserDto.first_name;
      if (updateUserDto.last_name)
        user.people.last_name = updateUserDto.last_name;
      if (updateUserDto.phone_number)
        user.people.phone_number = updateUserDto.phone_number;
      if (updateUserDto.birth_date)
        user.people.birth_date = new Date(updateUserDto.birth_date);
      if (updateUserDto.institute)
        user.people.institute = updateUserDto.institute;
      if (updateUserDto.dni) user.people.dni = updateUserDto.dni;
      await this.peopleRepository.save(user.people);
    }

    return this.userRepository.save(user);
  }

  async verifyUsers(userIds: string[], roleName: RoleEnum) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) throw new HttpError(404, 'Rol no encontrado');

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });

    if (users.length === 0) throw new HttpError(404, 'Usuarios no encontrados');

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        user.verified = true;
        user.role = role;
        return this.userRepository.save(user);
      })
    );

    return updatedUsers;
  }

  async findUnverifiedUsers() {
    return this.userRepository.find({
      where: { verified: false },
      relations: ['people', 'role'],
      select: {
        id: true,
        user_name: true,
        email: true,
        verified: true,
        people: {
          first_name: true,
          last_name: true,
          dni: true,
        },
        role: {
          name: true,
        },
      },
    });
  }
}
