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
import { ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'Get one product image.',
  })
  @ApiResponse({ status: 404, description: 'Product image not found.' })
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.findOneProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @ApiResponse({
    status: 201,
    description: 'Upload product image.',
    schema: {
      type: 'object',
      properties: {
        data: {
          properties: {
            secureUrl: {
              type: 'string',
              example:
                '[HOST]/api/files/product/48dfe7e4-5747-47cd-9d95-476ab8b43aa5.jpeg',
            },
            fileName: {
              type: 'string',
              example: '48dfe7e4-5747-47cd-9d95-476ab8b43aa5.jpeg',
            },
          },
        },
      },
    },
  })
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
    const fileName = file.filename;

    return {
      data: {
        secureUrl,
        fileName,
      },
    };
  }
}
