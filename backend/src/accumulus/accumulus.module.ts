import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Accumulus } from './accumulus.entity'
import { AccumulusRepository } from './accumulus.repository'
import { AccumulusController } from './accumulus.controller'
import { AccumulusGateway } from './accumulus.gateway'

@Module({
    imports: [TypeOrmModule.forFeature([Accumulus, AccumulusRepository])],
    controllers: [AccumulusController],
    providers: [AccumulusGateway],
})
export class AccumulusModule {}
