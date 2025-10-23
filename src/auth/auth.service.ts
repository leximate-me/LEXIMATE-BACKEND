import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { In } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private hashAdapter: BcryptAdapter,
    private jwtService: JwtService,
  ) {}
  async register({
    userName,
    birthDate,
    dni,
    email,
    firstName,
    institute,
    lastName,
    password,
    phoneNumber,
    role,
  }: RegisterAuthDto) {
    const foundUser = await this.usersService.findOneByEmail(email);

    if (foundUser) {
      throw new BadRequestException('El correo ya está en uso');
    }

    const hashedPassword = await this.hashAdapter.hash(password);

    const newUser = await this.usersService.create({
      userName,
      birthDate,
      dni,
      email,
      firstName,
      institute,
      lastName,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = await this.jwtService.signAsync(payload);

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async login({ email, password }: LoginAuthDto) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new BadRequestException('invalid email or password');
      }

      const isPasswordValid = await this.hashAdapter.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('invalid email or password');
      }
      console.log(user);

      const payload = { sub: user.id, email: user.email, role: user.role.name };
      const token = await this.jwtService.signAsync(payload);

      const { password: _, ...userWithoutPassword } = user;
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  getProfile(token: string) {
    const payload = this.jwtService.verify(token);

    const foundUser = this.usersService.findOneByEmail(payload.email);

    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    return foundUser;
  }

  async verifyToken(token: string) {
    const isValidToken = this.jwtService.verify(token);
    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }
    return isValidToken;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
