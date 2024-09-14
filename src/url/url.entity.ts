import {
  Entity, Column,
  ManyToOne
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { AbstractEntity } from 'src/shared/abstract.entity';

@Entity()
export class Url extends AbstractEntity {
  @Column()
  originalUrl: string;

  @Column({ unique: true })
  shortUrl: string;

  @Column({ default: 0 })
  clicks: number;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.urls)
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;
}
