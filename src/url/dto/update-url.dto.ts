import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL' })
  newOriginalUrl: string;
}
