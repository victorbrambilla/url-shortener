import { Module } from '@nestjs/common';
import { Tenant } from './tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenant.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    controllers: [],
    providers: [TenantService],
    exports: [TenantService],
})
export class TenantModule {}
