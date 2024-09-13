import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL' })
  originalUrl: string;
}
