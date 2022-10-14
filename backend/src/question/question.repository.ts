import { DeleteResult, EntityRepository, Repository } from 'typeorm'
import { UserToQuestionChoice } from 'src/userToQuestionChoice/userToQuestionChoice.entity'
import { UserToQuestionVote } from 'src/userToQuestionVote/userToQuestionVote.entity'
import { Question } from './question.entity'
import { QuestionWithCategoryDto, RawAdminListQuestion } from './interfaces/question.dto'

function shuffle<T>(array: T[]) {
    let currentIndex = array.length,
        randomIndex: number

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
}

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
    createQuestion = async (question: Question): Promise<Question> => {
        return this.save(question)
    }

    findOneQuestion = async (id: string) => {
        return this.createQueryBuilder('questions')
            .leftJoinAndMapOne('questions.category', 'questions.category', 'category')
            .leftJoinAndMapMany('questions.questionSets', 'questions.questionSets', 'question_sets')
            .where('questions.id = :id', { id })
            .getOne()
    }

    deleteQuestion = async (id: string): Promise<DeleteResult> => {
        return this.delete(Number(id))
    }

    getQuestionBaseQueryBuilder = () => {
        return this.createQueryBuilder('questions')
            .leftJoin('questions.category', 'category')
            .leftJoin('questions.questionSets', 'questionSet')
            .select([
                'questions.id',
                'questions.option1',
                'questions.option2',
                'category.name',
                'questions.isValidated',
                'questions.isJoke',
                'questions.isJokeOnSomeone',
            ])
    }

    findAll = async ({ questionSetId }: { questionSetId?: number }) => {
        let queryBuilder = this.getQuestionBaseQueryBuilder()
        if (questionSetId) {
            queryBuilder = queryBuilder.where('questionSet.id =:questionSetId', { questionSetId })
        }
        return queryBuilder.orderBy('questions.id', 'ASC').getMany()
    }

    findAdminList = () => {
        // choice1count and choice2count aggregation are computed in sql because it'd take too long to load UserToQuestionChoices entities and compute the result in js
        // we need to get a raw result because leftJoinAndMapOne does not seem to work if we want to add choice1Count property to Question entity
        return this.createQueryBuilder('questions')
            .leftJoinAndSelect('questions.questionSets', 'questionSet')
            .leftJoinAndSelect(
                (qb) =>
                    qb
                        .select('"questionId"')
                        .addSelect(`SUM(CASE when "choice" = 1 then 1 else 0 end) as choice1count`)
                        .addSelect(`SUM(CASE when "choice" = 2 then 1 else 0 end) as choice2count`)
                        .from(UserToQuestionChoice, 'user_to_question_choices')
                        .groupBy('"user_to_question_choices"."questionId"'),
                'user_to_question_choices',
                '"user_to_question_choices"."questionId" = "questions".id',
            )
            .leftJoinAndSelect(
                (qb) =>
                    qb
                        .select('"questionId"')
                        .addSelect(`SUM(CASE when "isUpVote" = true then 1 else 0 end) as upVotesCount`)
                        .addSelect(`SUM(CASE when "isUpVote" = false then 1 else 0 end) as downVotesCount`)
                        .from(UserToQuestionVote, 'user_to_question_votes')
                        .groupBy('"user_to_question_votes"."questionId"'),
                'user_to_question_votes',
                '"user_to_question_votes"."questionId" = "questions".id',
            )
            .getRawMany()
    }

    getAsakaiBaseQueryBuilder = ({ questionSetId }: { questionSetId: number }) => {
        return this.getQuestionBaseQueryBuilder()
            .where('questions.isValidated = true')
            .andWhere('questionSet.id = :questionSetId', { questionSetId })
            .orderBy('random()')
    }

    findAsakaiSet = async ({
        standardQuestionCount,
        jokeOnSomeoneCount,
        questionSetId,
    }: {
        standardQuestionCount: number
        jokeOnSomeoneCount: number
        questionSetId: number
    }) => {
        const classics: QuestionWithCategoryDto[] = await this.getAsakaiBaseQueryBuilder({ questionSetId })
            .andWhere('questions.isClassic = true AND questions.isJokeOnSomeone = false')
            .getMany()
        const jokesOnSomeone: QuestionWithCategoryDto[] =
            jokeOnSomeoneCount > 0
                ? await this.getAsakaiBaseQueryBuilder({ questionSetId })
                      .andWhere('questions.isClassic = false AND questions.isJokeOnSomeone = true')
                      .limit(jokeOnSomeoneCount)
                      .getMany()
                : []
        const standard: QuestionWithCategoryDto[] = standardQuestionCount
            ? await this.getAsakaiBaseQueryBuilder({ questionSetId })
                  .andWhere('questions.isClassic = false AND questions.isJokeOnSomeone = false')
                  .limit(standardQuestionCount)
                  .getMany()
            : []

        return shuffle([...classics, ...jokesOnSomeone, ...standard])
    }

    countClassics = async ({ questionSetId }: { questionSetId: number }): Promise<number> => {
        return await this.createQueryBuilder('questions')
            .leftJoin('questions.questionSets', 'questionSet')
            .where('questionSet.id = :questionSetId', { questionSetId })
            .andWhere('questions.isClassic = true')
            .getCount()
    }

    findByIdsWithCategory = async (questionIds: string[]): Promise<QuestionWithCategoryDto[]> => {
        const qb = this.getQuestionBaseQueryBuilder()
        if (questionIds.length) {
            qb.where('questions.id IN (:...questionIds)', { questionIds })
        }
        return qb.getMany()
    }
}
