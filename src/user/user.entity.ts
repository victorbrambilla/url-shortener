import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/shared/abstract.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { Url } from 'src/url/url.entity';
import {
  Entity, Column, ManyToOne,
  OneToMany
} from 'typeorm';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];
}
