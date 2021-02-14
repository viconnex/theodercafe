import { THEODO_COMPANY } from 'src/user/user.entity'
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import { QuestionFilters, QuestionPoll, SimilarityWithUserId } from './userToQuestionChoice.types'

const COMPANIES = [THEODO_COMPANY]
if (process.env.NODE_ENV === 'development') {
    COMPANIES.push('gmail')
}

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {
    async getAsakaiSet(questionIds: string[], excludedUserId?: string): Promise<UserToQuestionChoice[]> {
        let query = this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.company IN (:...companies)', { companies: COMPANIES })
            .andWhere('user.isActive IS true')
            .andWhere('user.isLoginPending IS false')

        if (excludedUserId) {
            query = query.andWhere('user.id != :userId', { userId: excludedUserId })
        }

        return query.andWhere('user_to_question_choices.questionId IN (:...questionIds)', { questionIds }).getMany()
    }

    async findByFiltersWithCount(
        questionFilters: QuestionFilters,
    ): Promise<{ choices: UserToQuestionChoice[]; count: number }> {
        let qb = this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .leftJoin('user_to_question_choices.question', 'question')
            .where('user.company IN (:...companies)', { companies: COMPANIES })

        if (questionFilters.isValidated || questionFilters.isNotValidated || questionFilters.isInValidation) {
            const validationFilters: (boolean | null)[] = []
            if (questionFilters.isValidated) {
                validationFilters.push(true)
            }
            if (questionFilters.isNotValidated) {
                validationFilters.push(false)
            }
            if (questionFilters.isInValidation) {
                validationFilters.push(null)
            }
            qb = qb.andWhere('question.isValidated IN (:...validationFilters)', { validationFilters })
        }

        if (questionFilters.isJoke || questionFilters.isNotJoke) {
            const jokeFilters: (boolean | null)[] = []
            if (questionFilters.isJoke) {
                jokeFilters.push(true)
            }
            if (questionFilters.isNotJoke) {
                jokeFilters.push(false)
            }
            qb = qb.andWhere('question.isJoke IN (:...jokeFilters)', { jokeFilters })
        }

        if (questionFilters.isJokeOnSomeone || questionFilters.isNotJokeOnSomeone) {
            const jokeFilters: (boolean | null)[] = []
            if (questionFilters.isJokeOnSomeone) {
                jokeFilters.push(true)
            }
            if (questionFilters.isNotJokeOnSomeone) {
                jokeFilters.push(false)
            }
            qb = qb.andWhere('question.isJokeOnSomeone IN (:...jokeFilters)', { jokeFilters })
        }

        const choices = await qb.getMany()
        const count: { count: number } = await qb
            .select('COUNT(DISTINCT "user_to_question_choices"."questionId")')
            .getRawOne()

        return { choices, ...count }
    }

    async selectSimilarityWithUserIds(userId: number): Promise<SimilarityWithUserId[]> {
        return this.createQueryBuilder('user_to_question_choices')
            .select('user_to_question_choices.userId', 'userId')
            .addSelect('COUNT(*)', 'commonQuestionCount')
            .addSelect(
                'SUM(CASE WHEN user_to_question_choices.choice = "targetChoice" THEN 1 ELSE 0 END)',
                'sameAnswerCount',
            )
            .addSelect('0', 'similarity')
            .innerJoin(
                this.createBaseQuestionSelectionQuery(userId),
                'utqc',
                '"utqc"."questionId" = user_to_question_choices.questionId',
            )
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user_to_question_choices.userId != :userId', { userId })
            .andWhere('user.company IN (:...companies)', { companies: COMPANIES })
            .groupBy('user_to_question_choices.userId')
            .getRawMany()
    }

    async countUserQuestionChoices(userId: number): Promise<number> {
        return this.createBaseQuestionSelectionQuery(userId)(this.createQueryBuilder()).getCount()
    }

    private createBaseQuestionSelectionQuery(
        userId: number,
    ): (query: SelectQueryBuilder<UserToQuestionChoice>) => SelectQueryBuilder<UserToQuestionChoice> {
        return (query: SelectQueryBuilder<UserToQuestionChoice>): SelectQueryBuilder<UserToQuestionChoice> => {
            return query
                .select('user_to_question_choices.questionId', 'questionId')
                .addSelect('user_to_question_choices.choice', 'targetChoice')
                .from(UserToQuestionChoice, 'user_to_question_choices')
                .leftJoin('user_to_question_choices.question', 'question')
                .where('user_to_question_choices.userId = :userId', { userId })
                .andWhere('question.isValidated = true')
                .andWhere('question.isJoke = false')
        }
    }

    getQuestionsPolls = (userId: number) => {
        if (typeof userId !== 'number') {
            throw new Error('the userId must be a number in getQuestionsPolls')
        }

        return this.query(`
            SELECT "questions"."id" as "questionId", "choice1" as "choice1Count", "choice2" as "choice2Count", "choice" as "userChoice"
            FROM questions
            LEFT JOIN (
            SELECT
                "questionId",
                SUM(CASE when "choice" = 1 then 1 else 0 end) as choice1,
                SUM(CASE when "choice" = 2 then 1 else 0 end) as choice2
            FROM user_to_question_choices
            GROUP BY "questionId"
            ) AS user_to_question_choices
            ON questions.id = "user_to_question_choices"."questionId"
            LEFT JOIN (
                SELECT "questionId","choice"
                FROM user_to_question_choices
                WHERE "user_to_question_choices"."userId" = ${userId}
            ) AS u_to_q_choices
            ON questions.id = "u_to_q_choices"."questionId"
            ORDER BY "questions"."id" ASC;
        `) as Promise<QuestionPoll[]>
    }
}
