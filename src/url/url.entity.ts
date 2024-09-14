import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Tenant } from 'src/tenant/tenant.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;   
}
