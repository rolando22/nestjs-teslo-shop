import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto } from './dto';

import type { JwtPayload } from './interfaces/jwt-payload.interface';

interface PostgresError extends Error {
  code: string;
  detail: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) private readonly userReposity: Repository<User>,
    private readonly encrypt: BcryptAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User & { token: string }> {
    try {
      const user = this.userReposity.create({
        ...registerDto,
        password: this.encrypt.hashSync(registerDto.password, 10),
      });

      await this.userReposity.save(user);

      return {
        ...user,
        token: this.generateJwt({ id: user.id }),
      };
    } catch (error) {
      throw this.handleExceptions(error as PostgresError);
    }
  }

  async login(loginDto: LoginDto): Promise<User & { token: string }> {
    const { email, password } = loginDto;

    const user = await this.userReposity.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    if (!this.encrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials.');
    }

    return {
      ...user,
      token: this.generateJwt({ id: user.id }),
    };
  }

  private generateJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: PostgresError) {
    if (error?.code === '23505') {
      return new BadRequestException(error?.detail);
    }
    // console.log(error);
    this.logger.error(error);
    return new InternalServerErrorException('Internal Server Error');
  }
}
