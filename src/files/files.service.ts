import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  findOneProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(
        `Product image with ${imageName} not found.`,
      );
    }

    return path;
  }
}
