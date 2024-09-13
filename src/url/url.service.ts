import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../user/user.entity';
import { nanoid } from 'nanoid';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
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

  async softDelete(shortUrl: string, user: User): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, user, deletedAt: null },
    });

    if (url) {
      url.deletedAt = new Date();
      await this.urlRepository.save(url);
    }
  }

  async updateUrl(
    shortUrl: string,
    newOriginalUrl: string,
    user: User,
  ): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, user, deletedAt: null },
    });

    if (url) {
      url.originalUrl = newOriginalUrl;
      await this.urlRepository.save(url);
    }
  }
}
