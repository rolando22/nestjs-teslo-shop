import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto } from './dto';

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
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const user = this.userReposity.create({
        ...registerDto,
        password: this.encrypt.hashSync(registerDto.password, 10),
      });

      await this.userReposity.save(user);

      return user;
    } catch (error) {
      throw this.handleExceptions(error as PostgresError);
    }
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.userReposity.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    if (!this.encrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials.');
    }

    return user;
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
