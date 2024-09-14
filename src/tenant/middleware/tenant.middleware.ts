import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const hostname = req.hostname;  
    const subdomain = hostname.split('.')[0];   
    const tenant = await this.tenantService.findByDomain(subdomain);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    req['tenantId'] = tenant.id;   

    next();
  }
}
