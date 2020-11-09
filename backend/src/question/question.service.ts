import { Injectable, HttpException } from '@nestjs/common'
import { QuestionRepository } from './question.repository'
import { CategoryRepository } from '../category/category.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { QuestionWithCategoryNameDto, QuestionPostDTO } from './interfaces/question.dto'
import { DeleteResult, FindManyOptions } from 'typeorm'
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
        let category = null
        if (typeof questionBody.category === 'number') {
            category = await this.categoryRepository.findOne(questionBody.category)
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
        const question = this.questionRepository.create({
            category,
            option1: questionBody.option1,
            option2: questionBody.option2,
            isClassic: false,
        })

        return this.questionRepository.save(question)
    }

    async findAsakaiSet(maxNumber: number, findFromHistoricIfExists: boolean): Promise<QuestionWithCategoryNameDto[]> {
        if (findFromHistoricIfExists) {
            const currentSet = await this.questioningHistoricService.findLastOfTheDay()
            if (currentSet && currentSet.questioning.length) {
                const sameQuestions = await this.questionRepository.findByIdsWithCategory(currentSet.questioning)
                const questionWithCategories = sameQuestions.sort(
                    (question1, question2): number =>
                        currentSet.questioning.indexOf(question1.id.toString()) -
                        currentSet.questioning.indexOf(question2.id.toString()),
                )
                return questionWithCategories.map(
                    (questionWithCategory): QuestionWithCategoryNameDto => ({
                        id: questionWithCategory.id,
                        option1: questionWithCategory.option1,
                        option2: questionWithCategory.option2,
                        isValidated: questionWithCategory.isValidated,
                        categoryName: questionWithCategory.category.name,
                    }),
                )
            }
        }

        const countClassics = await this.questionRepository.countClassics()
        const jokeAboutSomeoneCount =
            Math.random() < JOKE_ON_SOMEONE_PROBABILITY && maxNumber - countClassics[0].count > 0 ? 1 : 0
        const standardQuestionCount = Math.max(maxNumber - countClassics[0].count - jokeAboutSomeoneCount, 0)

        const asakaiSet = await this.questionRepository.findAsakaiSet(standardQuestionCount, jokeAboutSomeoneCount)

        this.questioningHistoricService.saveNew(asakaiSet.map((question): string => question.id.toString()))

        return asakaiSet
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

    findOne(id: string): Promise<Question> {
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
