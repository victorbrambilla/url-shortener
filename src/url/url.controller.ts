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
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { User } from '../user/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from './url.entity';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response.decorator';
import { UrlDto } from './dto/url.dto';
import { PageOptionsDto } from 'src/shared/dto/page-options.dto';
import { PageDto } from 'src/shared/dto/page.dto';
@ApiBearerAuth()
@ApiTags('URLs')
@Controller('urls')
@UseInterceptors(ClassSerializerInterceptor)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria uma URL encurtada' })
  @ApiResponse({ status: 201, description: 'URL criada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: Request,
  ): Promise<{ shortUrl: string }> {
    const user = req.user as User;
    const tenantId = req['tenantId'];
    const newUrl = await this.urlService.create({
      createUrlDto,
      user,
      tenantId,
    });
    return { shortUrl: newUrl.shortUrl };
  }
  @UseGuards(JwtAuthGuard)
  @Get('/tenant')
  @ApiOperation({ summary: 'Busca todas as URLs encurtadas pelo tenant' })
  @ApiResponse({ status: 200, description: 'URLs encontradas com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiPaginatedResponse(UrlDto)
  async findAll(
    @Req() req: Request,
    @Query() pageOptionsDto: PageOptionsDto,
  ):Promise<PageDto<UrlDto>> {
    const tenantId = req['tenantId'];
    return this.urlService.findAllByTenant(tenantId,pageOptionsDto);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redireciona para a URL original' })
  @ApiResponse({
    status: 302,
    description: 'Redirecionado para a URL original.',
  })
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
  @ApiOperation({ summary: 'Busca todas as URLs encurtadas' })
  @ApiResponse({ status: 200, description: 'URLs encontradas com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiPaginatedResponse(UrlDto)
  async findAllByUser(@Req() req: Request,
  @Query() pageOptionsDto: PageOptionsDto,
): Promise<PageDto<UrlDto>>  {
    const user = req.user as User;
    return this.urlService.findAllByUser(user, pageOptionsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta logicamente uma URL encurtada' })
  @ApiResponse({ status: 200, description: 'URL deletada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    await this.urlService.softDelete(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma URL encurtada' })
  @ApiResponse({ status: 200, description: 'URL atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUrlDto,
    @Req() req: Request,
  ): Promise<{ shortUrl: string }> {
    const user = req.user as User;

    const newUrl = await this.urlService.updateUrl(
      id,
      body.newOriginalUrl,
      user,
    );
    return newUrl;
  }
}
