import { Controller, Post, Body, Param, Get, Delete, Put, Req, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { User } from '../user/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req: Request): Promise<{ shortUrl: string }> {
    const user = req.user as User;
    const newUrl = await this.urlService.create(createUrlDto, user);
    return { shortUrl: newUrl.shortUrl };
  }

  @Get(':shortUrl')
  async redirectToOriginal(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
    const url = await this.urlService.findByShortUrl(shortUrl);

    if (url) {
      await this.urlService.incrementClicks(shortUrl);
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  }

  @Get()
  async findAllByUser(@Req() req: Request): Promise<any> {
    const user = req.user as User;
    return this.urlService.findAllByUser(user);
  }

  @Delete(':shortUrl')
  async delete(@Param('shortUrl') shortUrl: string, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    await this.urlService.softDelete(shortUrl, user);
  }

  @Put(':shortUrl')
  async update(@Param('shortUrl') shortUrl: string, @Body() body: { newOriginalUrl: string }, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    await this.urlService.updateUrl(shortUrl, body.newOriginalUrl, user);
  }
}
