import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accumulus } from './accumulus.entity';
import { AccumulusRepository } from './accumulus.repository';
import { AccumulusController } from './accumulus.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Accumulus, AccumulusRepository])],
    controllers: [AccumulusController],
})
export class AccumulusModule {}
