import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
    constructor(@InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository) {}

    @Get()
    findAll(): Promise<Category[]> {
        return this.categoryRepository.find({ select: ['id', 'name'], order: { name: 'ASC' } });
    }
}
