import { Controller, Get, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { Response } from 'express';

@Controller('categories')
export class CategoryController {
    constructor(@InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository) {}

    @Get('')
    async findAll(@Res() response: Response): Promise<void> {
        const result = await this.categoryRepository.find({ order: { name: 'ASC' } });
        response.set('Access-Control-Expose-Headers', 'X-Total-Count');
        response.set('X-Total-Count', result.length.toString());
        response.send(result);
    }
}
