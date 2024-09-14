import { AbstractEntity } from 'src/shared/abstract.entity';
import { Url } from 'src/url/url.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Tenant extends AbstractEntity {
  @Column({ unique: true })
  name: string;  

  @Column({ unique: true })
  domain: string;  

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Url, (url) => url.tenant)
  urls: Url[];
}
