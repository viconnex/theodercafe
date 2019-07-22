import { Injectable, HttpException } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CategoryRepository } from '../category/category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from './interfaces/question.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

const FIND_QUESTION_QUERY = `
    SELECT "questions"."id","questions"."option1", "questions"."option2", "categories"."name" as "categoryName"
    FROM questions
    LEFT JOIN categories on "questions"."categoryId"="categories"."id"
`;

const findWhereIsClassic = (isClassic: boolean, limit = null): string => {
    return `
        SELECT "questions"."id","questions"."option1", "questions"."option2", "categories"."name" as "categoryName"
        FROM questions
        LEFT JOIN categories on "questions"."categoryId"="categories"."id"
        WHERE "questions"."isClassic" = ${isClassic}
        ${null === limit ? '' : `LIMIT ${limit}`}
    `;
};

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
                        error: 'The category could not be saved, maybe it already exists',
                    },
                    500,
                );
            }
        }
        const question = this.questionRepository.create({
            category,
            option1: questionBody.option1,
            option2: questionBody.option2,
            isClassic: category ? category.name === 'Les classiques' : false,
        });

        return this.questionRepository.save(question);
    }

    async findAllClassicsAndRest(maxNumber: number): Promise<QuestionDto[]> {
        const countClassics = await this.questionRepository.query(
            `SELECT count(*) from "questions" WHERE "isClassic" = true`,
        );
        const nonClassicsCount = Math.max(maxNumber - countClassics[0].count, 0);

        return this.questionRepository.query(`
            SELECT *
            FROM (${findWhereIsClassic(true)} UNION (${findWhereIsClassic(false, nonClassicsCount)})) t
            ORDER BY random()
        `);
    }

    findAll(): Promise<QuestionDto[]> {
        return this.questionRepository.query(`${FIND_QUESTION_QUERY} ORDER BY random()`);
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

    async vote(questionId: number, optionIndex: number): Promise<UpdateResult> {
        const category = await this.questionRepository.findOne(questionId);
        if (optionIndex === 1) {
            return this.questionRepository.update(questionId, { option1Votes: category.option1Votes + 1 });
        }
        if (optionIndex === 2) {
            return this.questionRepository.update(questionId, { option2Votes: category.option2Votes + 1 });
        }
    }
}
