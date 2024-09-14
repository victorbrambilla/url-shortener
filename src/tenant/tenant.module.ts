import { Module } from '@nestjs/common';
import { Tenant } from './tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenant.service';
import { TenantSeederService } from './tenant-seeder.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    controllers: [],
    providers: [TenantService,TenantSeederService],
    exports: [TenantService],
})
export class TenantModule {}
