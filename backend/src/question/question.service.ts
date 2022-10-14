import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, DeleteResult, FindManyOptions } from 'typeorm'
import { Category } from 'src/category/category.entity'
import { QuestionSet } from 'src/questionSet/questionSet.entity'
import { QuestionRepository } from './question.repository'
import { CategoryRepository } from '../category/category.repository'
import { AdminListQuestion, QuestionPostDTO, QuestionUpdateBody, RawAdminListQuestion } from './interfaces/question.dto'
import { QuestioningHistoricService } from '../questioningHistoric/questioningHistoric.service'
import { QuestionSetService } from '../questionSet/questionSet.service'
import { Question } from './question.entity'
import { User } from '../user/user.entity'

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
        private readonly questioningHistoricService: QuestioningHistoricService,
        private readonly questionSetService: QuestionSetService,
    ) {}

    async create(questionBody: QuestionPostDTO, addedByUser: User): Promise<Question> {
        let category: Category | null = null
        if (typeof questionBody.category === 'number') {
            category = (await this.categoryRepository.findOne(questionBody.category)) ?? null
        } else if (typeof questionBody.category === 'string') {
            category = this.categoryRepository.create({ name: questionBody.category })
            try {
                await this.categoryRepository.save(category)
            } catch (err) {
                throw new HttpException(
                    {
                        status: 'error',
                        error: 'The category could not be saved, maybe it already exists',
                    },
                    500,
                )
            }
        }
        const questionSets = await this.questionSetService.getOrCreateQuestionSets(questionBody.questionSets)
        if (!questionSets.length) {
            throw new Error('No question sets found')
        }

        const questionPayload: DeepPartial<Question> = {
            option1: questionBody.option1,
            option2: questionBody.option2,
            isClassic: false,
            questionSets,
            addedByUser,
        }
        if (category) {
            questionPayload.category = category
        }

        const question: Question = this.questionRepository.create(questionPayload)

        return this.questionRepository.save(question)
    }

    async findAsakaiSet({
        maxNumber,
        findFromHistoricIfExists,
        questionSetId,
    }: {
        maxNumber: number
        findFromHistoricIfExists: boolean
        questionSetId: number
    }) {
        const questionSet = await this.questionSetService.findOneOrFail(questionSetId)
        if (findFromHistoricIfExists) {
            const currentSet = await this.questioningHistoricService.findLastOfTheDay({ questionSetId })
            if (currentSet?.questioning.length) {
                const sameQuestions = await this.questionRepository.findByIdsWithCategory(currentSet.questioning)
                const inOrderQuestions = sameQuestions.sort(
                    (question1, question2): number =>
                        currentSet.questioning.indexOf(question1.id.toString()) -
                        currentSet.questioning.indexOf(question2.id.toString()),
                )
                return {
                    questions: inOrderQuestions,
                    questioningId: currentSet.id,
                }
            }
        }

        const countClassics = await this.questionRepository.countClassics({ questionSetId })
        const jokeOnSomeoneCount = 0
        const standardQuestionCount = Math.max(maxNumber - countClassics - jokeOnSomeoneCount, 0)

        const asakaiSet = await this.questionRepository.findAsakaiSet({
            standardQuestionCount,
            jokeOnSomeoneCount,
            questionSetId,
        })

        const questioning = await this.questioningHistoricService.saveNew({
            questionIds: asakaiSet.map((question): string => question.id.toString()),
            questionSet,
        })

        return {
            questions: asakaiSet,
            questioningId: questioning.id,
        }
    }

    findAll({ questionSetId }: { questionSetId?: number }) {
        return this.questionRepository.findAll({ questionSetId })
    }

    async findAdminList() {
        const rawQuestions = (await this.questionRepository.findAdminList()) as RawAdminListQuestion[]

        const questionListById: { [id: number]: AdminListQuestion } = {}
        for (const rawQuestion of rawQuestions) {
            if (rawQuestion.questions_id in questionListById) {
                if (rawQuestion.questionSet_id) {
                    questionListById[rawQuestion.questions_id].questionSetIds.push(rawQuestion.questionSet_id)
                }
            } else {
                questionListById[rawQuestion.questions_id] = {
                    id: rawQuestion.questions_id,
                    addedByUserId: rawQuestion.questions_addedByUserId,
                    categoryId: rawQuestion.questions_categoryId,
                    isClassic: rawQuestion.questions_isClassic,
                    isValidated: rawQuestion.questions_isValidated,
                    isJoke: rawQuestion.questions_isJoke,
                    isJokeOnSomeone: rawQuestion.questions_isJokeOnSomeone,
                    option1: rawQuestion.questions_option1,
                    option2: rawQuestion.questions_option2,
                    questionSetIds: rawQuestion.questionSet_id ? [rawQuestion.questionSet_id] : [],
                    choice1Count: rawQuestion.choice1count,
                    choice2Count: rawQuestion.choice2count,
                    upVotesCount: rawQuestion.upvotescount,
                    downVotesCount: rawQuestion.downvotescount,
                }
            }
        }

        return Object.values(questionListById).reverse() // object keys are sorted alphabetically so reverse() makes order by id desc
    }

    async findOne(id: string) {
        const question = await this.questionRepository.findOneQuestion(id)
        if (!question) {
            return
        }
        return {
            ...question,
            questionSetIds: question.questionSets.map((questionSet) => questionSet.id),
        }
    }

    async update(id: string | number, question: QuestionUpdateBody) {
        const questionSets = await this.questionSetService.findByIds(question.questionSetIds)
        return this.questionRepository.save({ ...question, questionSets, id: Number(id) })
    }

    delete(id: string): Promise<DeleteResult> {
        return this.questionRepository.deleteQuestion(id)
    }
    find(options: FindManyOptions<Question>): Promise<Question[]> {
        return this.questionRepository.find(options)
    }

    async createNewHistoric({ questionIds, questionSetId }: { questionIds: number[]; questionSetId: number }) {
        const questionSet = await this.questionSetService.findOneOrFail(questionSetId)
        const questions = await this.questionRepository
            .createQueryBuilder('questions')
            .where('questions.id in (:...questionIds)', { questionIds })
            .getMany()
        if (questions.length !== questionIds.length) {
            throw new BadRequestException(
                `Only found ${questions.length} questions out of ${questionIds.length} requested`,
            )
        }
        return this.questioningHistoricService.saveNew({
            questionIds: questionIds.map((id) => id.toString()),
            questionSet,
        })
    }

    findByCategoryName(categoryName: string) {
        return this.questionRepository
            .createQueryBuilder('questions')
            .leftJoin('questions.category', 'category')
            .where('category.name = :categoryName', { categoryName })
            .getMany()
    }
}
