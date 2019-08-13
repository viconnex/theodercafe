import { Controller, Get, Body, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccumulusRepository } from './accumulus.repository';
import { Accumulus } from './accumulus.entity';

@Controller('accumulus')
export class AccumulusController {
    constructor(@InjectRepository(AccumulusRepository) private readonly accumulusRepository: AccumulusRepository) {}

    @Get('')
    async find(): Promise<Accumulus[]> {
        return this.accumulusRepository.find();
    }

    @Post()
    async create(@Body() accumulusBody): Promise<Accumulus> {
        return this.accumulusRepository.save(accumulusBody);
    }
}
