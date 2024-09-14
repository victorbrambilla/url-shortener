import { Tenant } from 'src/tenant/tenant.entity';
import { Url } from 'src/url/url.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;  
}
