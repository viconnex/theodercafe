import { Repository, EntityRepository } from 'typeorm';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { SimilarityWithUser } from './userToQuestionChoice.types';

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {
    async findByQuestionIds(questionIds): Promise<UserToQuestionChoice[]> {
        const companies = ['theodo'];
        if (process.env.NODE_ENV === 'development') {
            companies.push('gmail');
        }
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.company IN (:...companies)', { companies })
            .andWhere('user_to_question_choices.questionId IN (:...questionIds)', { questionIds })
            .getMany();
    }

    async findByValidatedQuestions(): Promise<UserToQuestionChoice[]> {
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.company IN (:...companies)', { companies: ['theodo', 'gmail'] })
            .leftJoin('user_to_question_choices.question', 'question')
            .where('question.isValidated = true OR question.isValidated IS NULL')
            .getMany();
    }

    async getUserCommonQuestionsAndSameAnswerCount(userId: number): Promise<SimilarityWithUser[]> {
        return this.query(`
            SELECT
                "userId",
                COUNT(*) as "commonQuestionCount",
                SUM(CASE WHEN "choice" = "targetChoice" THEN 1 ELSE 0 END) as "sameAnswerCount"
            FROM user_to_question_choices
            INNER JOIN (
                SELECT "userId" AS "targetUserId", "questionId", "choice" AS "targetChoice" FROM user_to_question_choices utqc
                WHERE "utqc"."userId" = ${userId}
            ) as utqc
            ON "utqc"."questionId" = "user_to_question_choices"."questionId"
            WHERE "user_to_question_choices"."userId" != ${userId}
            GROUP BY "userId";
        `);
    }
}
