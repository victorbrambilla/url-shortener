import { ApiProperty } from "@nestjs/swagger";

export class UrlDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalUrl: string;

  @ApiProperty()
  shortUrl: string;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  tenantId: string;
}