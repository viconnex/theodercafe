import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, DeleteResult, FindManyOptions } from 'typeorm'
import { Category } from 'src/category/category.entity'
import { QuestionRepository } from './question.repository'
import { CategoryRepository } from '../category/category.repository'
import { AsakaiQuestioning, QuestionPostDTO, QuestionWithCategoryNameDto } from './interfaces/question.dto'
import { QuestioningHistoricService } from '../questioningHistoric/questioningHistoric.service'
import { Question } from './question.entity'

const JOKE_ON_SOMEONE_PROBABILITY = 0.3

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
        private readonly questioningHistoricService: QuestioningHistoricService,
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

        const questionPayload: DeepPartial<Question> = {
            option1: questionBody.option1,
            option2: questionBody.option2,
            isClassic: false,
        }
        if (category) {
            questionPayload.category = category
        }

        const question: Question = this.questionRepository.create(questionPayload)

        return this.questionRepository.save(question)
    }

    async findAsakaiSet(maxNumber: number, findFromHistoricIfExists: boolean): Promise<AsakaiQuestioning> {
        if (findFromHistoricIfExists) {
            const currentSet = await this.questioningHistoricService.findLastOfTheDay()
            if (currentSet && currentSet.questioning.length) {
                const sameQuestions = await this.questionRepository.findByIdsWithCategory(currentSet.questioning)
                const questionWithCategories = sameQuestions.sort(
                    (question1, question2): number =>
                        currentSet.questioning.indexOf(question1.id.toString()) -
                        currentSet.questioning.indexOf(question2.id.toString()),
                )
                return {
                    questions: questionWithCategories.map(
                        (questionWithCategory: Question): QuestionWithCategoryNameDto => ({
                            id: questionWithCategory.id,
                            option1: questionWithCategory.option1,
                            option2: questionWithCategory.option2,
                            isValidated: questionWithCategory.isValidated,
                            categoryName: questionWithCategory.category?.name,
                        }),
                    ),
                    questioningId: currentSet.id,
                }
            }
        }

        const countClassics = await this.questionRepository.countClassics()
        const jokeAboutSomeoneCount =
            Math.random() < JOKE_ON_SOMEONE_PROBABILITY && maxNumber - countClassics[0].count > 0 ? 1 : 0
        const standardQuestionCount = Math.max(maxNumber - countClassics[0].count - jokeAboutSomeoneCount, 0)

        const asakaiSet = await this.questionRepository.findAsakaiSet(standardQuestionCount, jokeAboutSomeoneCount)

        const questioning = await this.questioningHistoricService.saveNew(
            asakaiSet.map((question): string => question.id.toString()),
        )

        return {
            questions: asakaiSet,
            questioningId: questioning.id,
        }
    }

    findInOrder(orderedIds: number[]): Promise<QuestionWithCategoryNameDto[]> {
        return this.questionRepository.findInOrder(orderedIds)
    }

    findAll(): Promise<QuestionWithCategoryNameDto[]> {
        return this.questionRepository.findAll()
    }

    findAdminList(): Promise<Question[]> {
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
}
