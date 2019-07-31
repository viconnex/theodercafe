import { Question } from './question.entity';
import { EntityRepository, Repository, DeleteResult } from 'typeorm';
import { QuestionDto } from './interfaces/question.dto';

const FIND_QUESTION_QUERY = `
    SELECT "questions"."id","questions"."option1", "questions"."option2", "categories"."name" as "categoryName"
    FROM questions
    LEFT JOIN categories on "questions"."categoryId"="categories"."id"
`;

const findWhereIsClassic = (isClassic: boolean, limit = null, isRandom: boolean = false): string => {
    return `${FIND_QUESTION_QUERY}
            WHERE "questions"."isClassic" = ${isClassic}
            ${isRandom ? 'ORDER BY random()' : ''}
            ${null === limit ? '' : `LIMIT ${limit}`}`;
};

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
    createQuestion = async (questionDto: QuestionDto | Question): Promise<QuestionDto & Question> => {
        return this.save(questionDto);
    };

    findOneQuestion = async (id: string): Promise<Question> => {
        return this.findOne(id, { relations: ['category'] });
    };

    updateQuestion = async (id: string, questionDto: QuestionDto): Promise<Question> => {
        return this.save({ ...questionDto, id: Number(id) });
    };

    deleteQuestion = async (id: string): Promise<DeleteResult> => {
        return this.delete(Number(id));
    };

    findAll = async (): Promise<QuestionDto[]> => {
        return this.query(`${FIND_QUESTION_QUERY} ORDER BY random()`);
    };

    findAdminList = async (): Promise<QuestionDto[]> => {
        return this.find({ relations: ['category'], order: { id: 'ASC' } });
    };

    findAllClassicsAndRest = async (nonClassicsCount: number): Promise<QuestionDto[]> => {
        return this.query(`
            SELECT *
            FROM (
                ${findWhereIsClassic(true)}
                UNION (
                ${findWhereIsClassic(false, nonClassicsCount, true)})
            ) t
            ORDER BY random()
        `);
    };

    countClassics = async (): Promise<number> => {
        return this.query(`SELECT count(*) from "questions" WHERE "isClassic" = true`);
    };
}
