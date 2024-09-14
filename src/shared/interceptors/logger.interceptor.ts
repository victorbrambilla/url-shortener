import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { Request } from 'express';
import { User } from 'src/user/user.entity';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const { method, originalUrl, headers } = request;
      const tenantId = request['tenantId'];  
      const user = request['user'];
      const startTime = Date.now();
      
      return next.handle().pipe(
        tap(() => {
          const elapsedTime = Date.now() - startTime;
          this.logger.log(
            //@ts-ignore
            `Tenant: ${tenantId || 'unknown'}, User: ${user?.id as any || 'unknown'} Method: ${method}, URL: ${originalUrl}, Time: ${elapsedTime}ms`,
          );
        }),
      );
    }
  }
  