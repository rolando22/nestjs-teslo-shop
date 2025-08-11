import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/product/:imageName')
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.findOneProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImageFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File must be a image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      data: { secureUrl },
    };
  }
}
