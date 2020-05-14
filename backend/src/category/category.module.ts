import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { CategoryRepository } from './category.repository'
import { CategoryController } from './category.controller'

@Module({
    imports: [TypeOrmModule.forFeature([Category, CategoryRepository])],
    controllers: [CategoryController],
})
export class CategoryModule {}
