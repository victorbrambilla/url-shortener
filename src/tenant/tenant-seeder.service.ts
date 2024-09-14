import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantSeederService implements OnModuleInit {
  private readonly logger = new Logger(TenantSeederService.name);

  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async onModuleInit() {
    if(process.env.NODE_ENV === 'production') {
        return;
    }
    await this.seedTenant();
  }

  private async seedTenant() {
    const tenantExists = await this.tenantRepository.findOne({ where: { domain: 'localhost' } });
    if (!tenantExists) {
      const tenant = this.tenantRepository.create({
        name: 'localhost',
        domain: 'localhost', 
      });

      await this.tenantRepository.save(tenant);
      this.logger.log('Default tenant seeded successfully.');
    } else {
      this.logger.log('Default tenant already exists.');
    }
  }
}
