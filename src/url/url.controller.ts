import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { User } from '../user/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: Request,
  ): Promise<{ shortUrl: string }> {
    const user = req.user as User;
    const newUrl = await this.urlService.create(createUrlDto, user);
    return { shortUrl: newUrl.shortUrl };
  }

  @Get(':shortUrl')
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlService.findByShortUrl(shortUrl);

    if (url) {
      await this.urlService.incrementClicks(shortUrl);
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByUser(@Req() req: Request): Promise<any> {
    const user = req.user as User;
    return this.urlService.findAllByUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    await this.urlService.softDelete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { newOriginalUrl: string },
  ): Promise<{ shortUrl: string }> {
    console.log('id', id);
    const newUrl = await this.urlService.updateUrl(id, body.newOriginalUrl);
    return newUrl;
  }
}
