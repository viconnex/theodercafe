import { User } from 'src/user/user.entity'
import { CompanyDomain } from 'src/user/user.types'
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import { QuestionFilters, SimilarityWithUserId } from './userToQuestionChoice.types'

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {
    async getOthersChoices(questionIds: string[], user: User): Promise<UserToQuestionChoice[]> {
        const { domain } = user.getCompanyDomain()
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.isActive IS true')
            .andWhere('user.isLoginPending IS false')
            .andWhere('user.id != :userId', { userId: user.id })
            .andWhere('user.email LIKE :sameCompanyEmail', { sameCompanyEmail: `%@${domain}` })
            .andWhere('user_to_question_choices.questionId IN (:...questionIds)', { questionIds })
            .getMany()
    }

    async findByFiltersWithCount(
        companyDomain: CompanyDomain,
        questionFilters: QuestionFilters,
    ): Promise<{ choices: UserToQuestionChoice[]; count: number }> {
        let qb = this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .leftJoin('user_to_question_choices.question', 'question')
            .where('user.email LIKE :sameCompanyEmail', { sameCompanyEmail: `%@${companyDomain.domain}` })

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

    async selectSimilarityWithUser(user: User): Promise<SimilarityWithUserId[]> {
        const companyDomain = user.getCompanyDomain()

        return this.createQueryBuilder('user_to_question_choices')
            .select('user_to_question_choices.userId', 'userId')
            .addSelect('COUNT(*)', 'commonQuestionCount')
            .addSelect(
                'SUM(CASE WHEN user_to_question_choices.choice = "targetChoice" THEN 1 ELSE 0 END)',
                'sameAnswerCount',
            )
            .addSelect('0', 'similarity')
            .innerJoin(
                this.createBaseQuestionSelectionQuery(user.id),
                'utqc',
                '"utqc"."questionId" = user_to_question_choices.questionId',
            )
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user_to_question_choices.userId != :userId', { userId: user.id })
            .andWhere('user.email LIKE :sameCompanyEmail', {
                sameCompanyEmail: `%@${companyDomain.domain}`,
            })
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
}
