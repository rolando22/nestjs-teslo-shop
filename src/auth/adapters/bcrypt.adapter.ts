import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EncryptAdapter } from '@auth/interfaces/encrypt-adapter.interface';

@Injectable()
export class BcryptAdapter implements EncryptAdapter {
  private bcrypt: typeof bcrypt = bcrypt;

  hashSync(data: string | Buffer, saltOrRounds: string | number): string {
    return this.bcrypt.hashSync(data, saltOrRounds);
  }

  compareSync(data: string | Buffer, encrypted: string): boolean {
    return this.bcrypt.compareSync(data, encrypted);
  }
}
