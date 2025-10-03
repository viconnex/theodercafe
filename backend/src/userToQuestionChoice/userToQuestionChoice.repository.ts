import { User } from 'src/user/user.entity'
import { CompanyDomain } from 'src/user/user.types'
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import { QuestionFilters } from './userToQuestionChoice.types'

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {
    async getOthersChoices(questionIds: string[], user: User): Promise<UserToQuestionChoice[]> {
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.isActive IS true')
            .andWhere('user.isLoginPending IS false')
            .andWhere('user.id != :userId', { userId: user.id })
            .andWhere('user_to_question_choices.questionId IN (:...questionIds)', { questionIds })
            .getMany()
    }

    async findByFiltersWithCount(
        questionFilters: QuestionFilters,
    ): Promise<{ choices: UserToQuestionChoice[]; count: number }> {
        let qb = this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .leftJoin('user_to_question_choices.question', 'question')

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
