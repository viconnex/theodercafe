import { Controller, Get, Body, Post, Res } from '@nestjs/common';
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
    async create(@Body() accumulusBody, @Res() response): Promise<void> {
        const result = await this.accumulusRepository.save(accumulusBody);
        response.header('Access-Control-Allow-Origin', 'https://victorbrun.github.io');
        response.send(result);
    }
}
