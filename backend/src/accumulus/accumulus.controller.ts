import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AccumulusRepository } from './accumulus.repository'
import { Accumulus } from './accumulus.entity'

@Controller('accumulus')
export class AccumulusController {
    constructor(@InjectRepository(AccumulusRepository) private readonly accumulusRepository: AccumulusRepository) {}

    @Get('')
    async find(): Promise<Accumulus[]> {
        return this.accumulusRepository.find()
    }

    @Post()
    async create(@Body() accumulusBody: { name?: string; nuages?: string }): Promise<Accumulus | BadRequestException> {
        if (!accumulusBody['name'] || !accumulusBody['nuages']) {
            return new BadRequestException()
        }
        return this.accumulusRepository.save(accumulusBody)
    }
}
