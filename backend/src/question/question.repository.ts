import { DeleteResult, EntityRepository, Repository } from 'typeorm'
import { Question } from './question.entity'
import { QuestionAdmin, QuestionWithCategoryDto } from './interfaces/question.dto'

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
        return this.findOne(id, { relations: ['category'] })
    }

    updateQuestion = async (id: string | number, question: Question): Promise<Question> => {
        return this.save({ ...question, id: Number(id) })
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
        return this.query(`
            SELECT "id", "option1", "option2", "categoryId", "isClassic", "isValidated", "isJoke", "isJokeOnSomeone", "choice1count", "choice2count", "up_votes_count" AS "upVotes", "down_votes_count" AS "downVotes" FROM questions AS q
            LEFT JOIN (
            SELECT
                "questionId",
                SUM(CASE when "choice" = 1 then 1 else 0 end) as choice1count,
                SUM(CASE when "choice" = 2 then 1 else 0 end) as choice2count
            FROM user_to_question_choices
            GROUP BY "questionId"
            ) AS u_to_q_choices
            ON q.id = "u_to_q_choices"."questionId"
            LEFT JOIN (
            SELECT
                "questionId",
                SUM(CASE when "isUpVote" = true then 1 else 0 end) as up_votes_count,
                SUM(CASE when "isUpVote" = false then 1 else 0 end) as down_votes_count
            FROM user_to_question_votes
            GROUP BY "questionId"
            ) as u_to_q_votes
            ON q.id = "u_to_q_votes"."questionId"
            ORDER BY "q"."id" DESC;
        `) as Promise<QuestionAdmin[]>
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
