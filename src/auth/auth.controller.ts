import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import type { Response } from 'express';
import { Cookies } from 'src/common/decorators/cookies.decorator/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() registerAuhDto: RegisterAuthDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.register(registerAuhDto);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    });

    return res.json(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    const result = await this.authService.login(loginAuthDto);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    });

    return res.json(result);
  }

  @Get('profile')
  getProfile(@Cookies('token') token: string) {
    return this.authService.getProfile(token);
  }

  @Get('verify')
  verifyToken(@Cookies('token') token: string) {
    return this.authService.verifyToken(token);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
