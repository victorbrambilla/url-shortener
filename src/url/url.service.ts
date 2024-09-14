import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../user/user.entity';
import { nanoid } from 'nanoid';
import { CreateUrlDto } from './dto/create-url.dto';
import { AbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/casl/enums/actions.enum';
import { PageOptionsDto } from 'src/shared/dto/page-options.dto';
import { UrlDto } from './dto/url.dto';
import { PageDto } from 'src/shared/dto/page.dto';
import { PageMetaDto } from 'src/shared/dto/page-meta.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async create({
    createUrlDto,
    user,
    tenantId,
  }: {
    createUrlDto: CreateUrlDto;
    user?: User;
    tenantId?: string;
  }): Promise<Url> {
    const shortUrl = nanoid(6);

    const newUrl = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl,
      shortUrl,
      user,
      tenantId,
    });

    await this.urlRepository.save(newUrl);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fullShortUrl = `${baseUrl}/urls/${shortUrl}`;
    return { ...newUrl, shortUrl: fullShortUrl };
  }

  async findByShortUrl(shortUrl: string): Promise<Url> {
    return this.urlRepository.findOne({
      where: { shortUrl, deletedAt: IsNull() },
    });
  }

  async incrementClicks(shortUrl: string): Promise<void> {
    const url = await this.findByShortUrl(shortUrl);
    if (url) {
      url.clicks += 1;
      await this.urlRepository.save(url);
    }
  }

  async softDelete(id: string, user: User): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { id },
    });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    const ability = this.abilityFactory.defineAbility(user as User);
    const can = ability.can(Action.DELETE, url);
    if (!can) {
      throw new ForbiddenException('You are not allowed to delete this URL');
    }
    if (url) {
      url.deletedAt = new Date();
      await this.urlRepository.save(url);
    }
  }

  async updateUrl(
    id: string,
    newOriginalUrl: string,
    user: User,
  ): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: {
        id,
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    const ability = this.abilityFactory.defineAbility(user as User);
    const can = ability.can(Action.UPDATE, url);

    if (!can) {
      throw new ForbiddenException('You are not allowed to update this URL');
    }

    if (url) {
      url.originalUrl = newOriginalUrl;
      await this.urlRepository.save(url);
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const fullShortUrl = `${baseUrl}/${url.shortUrl}`;
      return { ...url, shortUrl: fullShortUrl };
    }
  }

  async findAllByTenant(
    tenantId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UrlDto>> {
    const queryBuilder = this.urlRepository.createQueryBuilder('url');
    queryBuilder.where('url.tenantId = :tenantId', { tenantId });
    queryBuilder.andWhere('url.deletedAt IS NULL');
    queryBuilder.orderBy('url.createdAt', 'DESC');
    queryBuilder.skip(pageOptionsDto.skip);
    queryBuilder.take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllByUser(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UrlDto>> {
    const queryBuilder = this.urlRepository.createQueryBuilder('url');
    queryBuilder.where('url.userId = :userId', { userId: user.id });
    queryBuilder.andWhere('url.deletedAt IS NULL');
    queryBuilder.orderBy('url.createdAt', 'DESC');
    queryBuilder.skip(pageOptionsDto.skip);
    queryBuilder.take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }
}
