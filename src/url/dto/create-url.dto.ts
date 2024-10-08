import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL' })
  originalUrl: string;
}
