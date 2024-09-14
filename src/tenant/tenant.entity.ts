import { Url } from 'src/url/url.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;  

  @Column({ unique: true })
  domain: string;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Url, (url) => url.tenant)
  urls: Url[];
}
