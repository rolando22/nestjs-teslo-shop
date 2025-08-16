import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto } from './dto';
import { Auth, GetUser } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Register.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Email already registered.',
  })
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);

    return {
      data,
    };
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid credentials.',
  })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    return {
      data,
    };
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Check status.',
    type: User,
  })
  checkStatus(@GetUser() user: User) {
    const data = this.authService.checkStatus(user);

    return {
      data,
    };
  }
}
