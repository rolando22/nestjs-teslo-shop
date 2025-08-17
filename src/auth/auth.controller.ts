import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, getSchemaPath } from '@nestjs/swagger';

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
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(User) },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExZjU3YmM0LTFhYTQtNDUxNC05M2UyLTk3OWMxMTVlOTVhMSIsImlhdCI6MTc1NTI4OTUyOCwiZXhwIjoxNzU1Mjk2NzI4fQ.004HXHZ54vetJ8WIhLXYPoQ_q6bOdE-c0q0bPgUH8oc',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Email already registered.',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ data: { user: User; token: string } }> {
    const data = await this.authService.register(registerDto);

    return {
      data,
    };
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login.',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(User) },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExZjU3YmM0LTFhYTQtNDUxNC05M2UyLTk3OWMxMTVlOTVhMSIsImlhdCI6MTc1NTI4OTUyOCwiZXhwIjoxNzU1Mjk2NzI4fQ.004HXHZ54vetJ8WIhLXYPoQ_q6bOdE-c0q0bPgUH8oc',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid credentials.',
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ data: { user: User; token: string } }> {
    const data = await this.authService.login(loginDto);

    return {
      data,
    };
  }

  @Get('check-status')
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Check status.',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(User) },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExZjU3YmM0LTFhYTQtNDUxNC05M2UyLTk3OWMxMTVlOTVhMSIsImlhdCI6MTc1NTI4OTUyOCwiZXhwIjoxNzU1Mjk2NzI4fQ.004HXHZ54vetJ8WIhLXYPoQ_q6bOdE-c0q0bPgUH8oc',
        },
      },
    },
  })
  checkStatus(@GetUser() user: User): { data: { user: User; token: string } } {
    const data = this.authService.checkStatus(user);

    return {
      data,
    };
  }
}
