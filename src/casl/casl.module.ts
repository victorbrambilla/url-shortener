import { Module } from '@nestjs/common';
import { AbilityFactory } from './casl-ability.factory/casl-ability.factory';
 
@Module({
    imports: [],
    controllers: [],
    providers: [AbilityFactory],
    exports: [AbilityFactory],
})
export class CaslModule {}
