import { User } from '@auth/entities/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    return !data ? user : user[data];
  },
);
