import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Url } from 'src/url/url.entity';
import { User } from 'src/user/user.entity';
import { Action } from '../enums/actions.enum';

export type Subjects = InferSubjects<typeof Url | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    can([Action.READ,Action.UPDATE,Action.DELETE], Url, { userId: user.id, tenantId: user.tenantId });

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}