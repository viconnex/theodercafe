import { Injectable, HttpException } from '@nestjs/common';
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
        if (typeof questionBody.category === 'number') {
            category = await this.categoryRepository.findOne(questionBody.category);
        } else if (typeof questionBody.category === 'string') {
            category = this.categoryRepository.create({ name: questionBody.category });
            try {
                await this.categoryRepository.save(category);
            } catch (err) {
                throw new HttpException(
                    {
                        status: 'error',
                        error: 'The question ',
                    },
                    500,
                );
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
        return this.questionRepository.query(`
            SELECT "questions"."id","questions"."option1", "questions"."option2", "categories"."name" as "categoryName"
            FROM questions
            LEFT JOIN categories on "questions"."categoryId"="categories"."id"
            ORDER BY random()
        `);
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
