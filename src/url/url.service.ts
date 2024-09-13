import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../user/user.entity';
import { nanoid } from 'nanoid';
import { CreateUrlDto } from './dto/create-url.dto';
import { AbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/casl/enums/actions.enum';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private readonly abilityFactory: AbilityFactory,  // Injetar AbilityFactory

  ) {}

  async create(createUrlDto: CreateUrlDto, user?: User): Promise<Url> {
    const shortUrl = nanoid(6);

    const newUrl = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl,
      shortUrl,
      user,
    });

    await this.urlRepository.save(newUrl);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fullShortUrl = `${baseUrl}/${shortUrl}`;
    return { ...newUrl, shortUrl: fullShortUrl };
  }

  async findByShortUrl(shortUrl: string): Promise<Url> {
    return this.urlRepository.findOne({ where: { shortUrl, deletedAt: null } });
  }

  async incrementClicks(shortUrl: string): Promise<void> {
    const url = await this.findByShortUrl(shortUrl);
    if (url) {
      url.clicks += 1;
      await this.urlRepository.save(url);
    }
  }

  async findAllByUser(user: User): Promise<Url[]> {
    return this.urlRepository.find({
      where: { user, deletedAt: null },
      order: { createdAt: 'DESC' },
    });
  }

  async softDelete(id: string,user:User): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { id },
    });
    const ability = this.abilityFactory.defineAbility(user as User);
    const can = ability.can(Action.DELETE, url);
    if(!can){
      throw new ForbiddenException('You are not allowed to delete this URL');
    }
    if (url) {
      url.deletedAt = new Date();
      await this.urlRepository.save(url);
    }
  }

  async updateUrl(id: string, newOriginalUrl: string,user:User): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: {
        id,
      },
    });
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
}
