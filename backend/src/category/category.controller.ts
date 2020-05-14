import { Controller, Get, NotFoundException, Res, Param, Body, Put, Delete, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryRepository } from './category.repository'
import { Response } from 'express'
import { Category } from './category.entity'
import { DeleteResult } from 'typeorm'

@Controller('categories')
export class CategoryController {
    constructor(@InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository) {}

    @Get('')
    async findAll(@Res() response: Response): Promise<void> {
        const result = await this.categoryRepository.find({ order: { name: 'ASC' } })
        response.set('Access-Control-Expose-Headers', 'X-Total-Count')
        response.set('X-Total-Count', result.length.toString())
        response.send(result)
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne(id)
        if (!category) throw new NotFoundException()

        return category
    }

    @Put(':id')
    async edit(@Param('id') id: string, @Body() categoryBody): Promise<Category> {
        const category = await this.categoryRepository.save({ ...categoryBody, id: Number(id) })
        if (!category) throw new NotFoundException()

        return category
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.categoryRepository.delete(id)
        if (deleteResult.affected === 0) throw new NotFoundException()

        return deleteResult
    }

    @Post()
    create(@Body() categoryBody): Promise<Category> {
        return this.categoryRepository.save(categoryBody)
    }
}
