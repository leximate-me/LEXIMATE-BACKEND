import { AppDataSource } from '../../database/db';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, People, Role } from './entities';

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

  async findRoleByName(role: string) {
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
}
