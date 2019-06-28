import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './questions.repository';
import { CategoryRepository } from '../categories/category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsDto } from './interfaces/questions.dto';
import { DeleteResult } from 'typeorm';
import { Questions } from './questions.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
    ) {}

    async create(questionBody): Promise<QuestionsDto> {
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

    findAll(): Promise<QuestionsDto[]> {
        return this.questionRepository.find({ relations: ['category'] });
    }

    findOne(id: string): Promise<QuestionsDto> {
        return this.questionRepository.findOneQuestion(id);
    }

    update(id: string, questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionRepository.updateQuestion(id, questionsDto);
    }

    delete(id: string): Promise<DeleteResult> {
        return this.questionRepository.deleteQuestion(id);
    }
}
