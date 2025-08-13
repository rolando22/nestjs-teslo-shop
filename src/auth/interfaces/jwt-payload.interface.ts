import { User } from '@auth/entities/user.entity';

export interface JwtPayload {
  id: User['id'];
}
