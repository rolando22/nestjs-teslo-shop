import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email',
    example: 'test1@gmail.com',
    type: String,
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'Prueba123',
    type: String,
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'FullName',
    example: 'Test One',
    type: String,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
