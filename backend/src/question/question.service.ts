import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, DeleteResult, FindManyOptions } from 'typeorm'
import { Category } from 'src/category/category.entity'
import { QuestionRepository } from './question.repository'
import { CategoryRepository } from '../category/category.repository'
import { QuestionPostDTO } from './interfaces/question.dto'
import { QuestioningHistoricService } from '../questioningHistoric/questioningHistoric.service'
import { QuestionSetService } from '../questionSet/questionSet.service'
import { Question } from './question.entity'

const JOKE_ON_SOMEONE_PROBABILITY = 0.3

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
        private readonly questioningHistoricService: QuestioningHistoricService,
        private readonly questionSetService: QuestionSetService,
    ) {}

    async create(questionBody: QuestionPostDTO): Promise<Question> {
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
        const jokeOnSomeoneCount = Math.random() < JOKE_ON_SOMEONE_PROBABILITY && maxNumber - countClassics > 0 ? 1 : 0
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

    findAdminList() {
        return this.questionRepository.findAdminList()
    }

    findOne(id: string) {
        return this.questionRepository.findOneQuestion(id)
    }

    update(id: string | number, question: Question): Promise<Question> {
        return this.questionRepository.updateQuestion(id, question)
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
