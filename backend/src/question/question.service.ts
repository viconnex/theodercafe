import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CategoryRepository } from '../category/category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from './interfaces/question.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
    ) {}

    async create(questionBody): Promise<QuestionDto> {
        let category = null;
        if (questionBody.categoryId) {
            category = await this.categoryRepository.findOne(questionBody.categoryId);
        } else if (questionBody.categoryName) {
            category = this.categoryRepository.create({ name: questionBody.categoryName });
            try {
                await this.categoryRepository.save(category);
            } catch (err) {
                console.log(err);
            }
        }

        const question = this.questionRepository.create({
            category,
            option1: questionBody.option1,
            option2: questionBody.option2,
        });

        return this.questionRepository.save(question);
    }

    findAll(): Promise<QuestionDto[]> {
        return this.questionRepository.find({ relations: ['category'], order: { id: 'ASC' } });
    }

    findOne(id: string): Promise<QuestionDto> {
        return this.questionRepository.findOneQuestion(id);
    }

    update(id: string, questionDto: QuestionDto): Promise<QuestionDto> {
        return this.questionRepository.updateQuestion(id, questionDto);
    }

    delete(id: string): Promise<DeleteResult> {
        return this.questionRepository.deleteQuestion(id);
    }
}
