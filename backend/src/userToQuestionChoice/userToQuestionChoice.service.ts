import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DeepPartial } from 'typeorm'
import { UserWithPublicFields } from '../user/user.types'
import { THEODO_COMPANY, User } from '../user/user.entity'
import { QuestionService } from '../question/question.service'
import { MBTI_INDEX_LETTERS_BY_OPTION_1, MbtiIndexAndLetters } from './constants'
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import {
    Alterodos,
    AsakaiChoices,
    AsakaiEmailDTO,
    Choice,
    QuestionFilters,
    QuestionPoll,
    SimilarityWithUserId,
    UserMap,
} from './userToQuestionChoice.types'

import { UserService } from '../user/user.service'
import { createUsersChoicesMatrix, getBestAlterodos } from './userToQuestionChoice.helpers'

// eslint-disable-next-line
const PCA = require('pca-js')

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
        private readonly userService: UserService,
        private readonly questionService: QuestionService,
    ) {}

    async saveChoice(questionId: number, userId: number, choice: Choice): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            userId,
            questionId,
        })

        if (!initialChoice) {
            const newChoice = this.userToQuestionChoiceRepository.create({
                userId,
                questionId,
                choice,
            })

            return this.userToQuestionChoiceRepository.save(newChoice)
        }

        if (initialChoice && initialChoice.choice === choice) {
            return initialChoice
        }
        initialChoice.choice = choice

        return this.userToQuestionChoiceRepository.save(initialChoice)
    }

    async getQuestionsPolls({ user, questionSetId }: { user: User; questionSetId: number }) {
        const questionsPolls: Record<number, QuestionPoll> = {}
        let queryBuilder = this.userToQuestionChoiceRepository
            .createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.question', 'questions')
            .leftJoin('questions.questionSets', 'question_sets')
            .where('question_sets.id = :questionSetId', { questionSetId })

        if (user?.company === THEODO_COMPANY) {
            queryBuilder = queryBuilder
                .leftJoin('user_to_question_choices.user', 'user')
                .andWhere('user.company = :theodoCompany', { theodoCompany: THEODO_COMPANY })
        }
        const userToQuestionChoices = await queryBuilder
            .select([
                'user_to_question_choices.questionId',
                'user_to_question_choices.userId',
                'user_to_question_choices.choice',
            ])
            .getMany()

        userToQuestionChoices.forEach((answer) => {
            if (!(answer.questionId in questionsPolls)) {
                questionsPolls[answer.questionId] = {
                    userChoice: null,
                    choice1UserIds: [],
                    choice2UserIds: [],
                }
            }
            if (answer.userId === user.id) {
                questionsPolls[answer.questionId].userChoice = answer.choice
            }
            const choiceField = `choice${answer.choice}UserIds` as 'choice1UserIds' | 'choice2UserIds'
            questionsPolls[answer.questionId][choiceField].push(answer.userId)
        })

        return questionsPolls
    }

    async findAsakaiAlterodos(asakaiChoices: AsakaiChoices, excludedUserId?: string) {
        const answeredQuestionsIds = Object.keys(asakaiChoices)
        if (answeredQuestionsIds.length === 0) {
            throw new BadRequestException('user must answer to at least one question')
        }

        const alterodos = await this.findAlterodosFromAsakaiChoices(asakaiChoices, excludedUserId)

        return this.createAlterodosResponse(answeredQuestionsIds.length, alterodos)
    }

    async getUserAlterodos(userId: number) {
        const baseQuestionCount = await this.userToQuestionChoiceRepository.countUserQuestionChoices(userId)
        const similarityWithUserIds = await this.userToQuestionChoiceRepository.selectSimilarityWithUserIds(userId)

        const alterodos = getBestAlterodos(similarityWithUserIds, Math.sqrt(baseQuestionCount))

        return this.createAlterodosResponse(baseQuestionCount, alterodos)
    }

    async createMap(questionFilters: QuestionFilters): Promise<UserMap[]> {
        const {
            choices: userToQuestionChoices,
            count: questionCount,
        } = await this.userToQuestionChoiceRepository.findByFiltersWithCount(questionFilters)

        const userQuestionMatrixWithUserIndex = createUsersChoicesMatrix(userToQuestionChoices, questionCount)
        const data = userQuestionMatrixWithUserIndex.usersChoicesMatrix

        const vectors = PCA.getEigenVectors(data)
        const adData = PCA.computeAdjustedData(data, vectors[0], vectors[1])

        // const topTwo = PCA.computePercentageExplained(vectors, vectors[0], vectors[1]);
        // console.log('topTwo', topTwo);

        const users = await this.userService.findWithPublicFields(userQuestionMatrixWithUserIndex.userIds)

        const usersMap: UserMap[] = []

        adData.formattedAdjustedData[0].forEach((x: number, index: number) => {
            const user = users.find(
                (user: UserWithPublicFields): boolean => user.id === userQuestionMatrixWithUserIndex.userIds[index],
            )
            if (!user) {
                return
            }
            usersMap.push({
                x: x,
                y: adData.formattedAdjustedData[1][index],
                ...user,
            })
        })

        return usersMap
    }

    async handleAsakaiEmailSending({
        email,
        addedByUserId,
        asakaiChoices,
        alterodoUserId,
    }: AsakaiEmailDTO): Promise<string> {
        const newUser = await this.userService.createUserWithEmail(email, addedByUserId, alterodoUserId)

        if (!newUser) {
            return 'no user created'
        }

        const choices: DeepPartial<UserToQuestionChoice>[] = []
        for (const questionId in asakaiChoices) {
            choices.push({ questionId: parseInt(questionId), choice: asakaiChoices[questionId], userId: newUser.id })
        }
        if (asakaiChoices) {
            await this.userToQuestionChoiceRepository.save(choices)
        }

        return 'user created'
    }

    private async createAlterodosResponse(baseQuestionCount: number, alterodos: Alterodos) {
        const alterodo = await this.userService.findOneWithPublicFields(alterodos.alterodo.userId)
        const varieto = await this.userService.findOneWithPublicFields(alterodos.varieto.userId)

        if (!alterodo || !varieto) {
            throw new Error('alterodo or varieto not found')
        }

        return {
            baseQuestionCount,
            alterodo: {
                ...alterodos.alterodo,
                ...alterodo,
            },
            varieto: {
                ...alterodos.varieto,
                ...varieto,
            },
        }
    }

    private async findAlterodosFromAsakaiChoices(
        asakaiChoices: AsakaiChoices,
        excludedUserId?: string,
    ): Promise<Alterodos> {
        const answeredQuestionsIds = Object.keys(asakaiChoices)
        const commonAnswersWithUsers: { [id: number]: SimilarityWithUserId } = {}

        const userToQuestionChoices = await this.userToQuestionChoiceRepository.getAsakaiSet(
            answeredQuestionsIds,
            excludedUserId,
        )
        if (userToQuestionChoices.length === 0) {
            throw new BadRequestException('no choices have been made by other users')
        }

        userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
            const isSameChoice = asakaiChoices[userToQuestionChoice.questionId] === userToQuestionChoice.choice
            if (!commonAnswersWithUsers.hasOwnProperty(userToQuestionChoice.userId)) {
                commonAnswersWithUsers[userToQuestionChoice.userId] = {
                    commonQuestionCount: 1,
                    sameAnswerCount: isSameChoice ? 1 : 0,
                    similarity: 0,
                    userId: userToQuestionChoice.userId,
                }
            } else {
                commonAnswersWithUsers[userToQuestionChoice.userId].sameAnswerCount += isSameChoice ? 1 : 0
                commonAnswersWithUsers[userToQuestionChoice.userId].commonQuestionCount += 1
            }
        })

        return getBestAlterodos(Object.values(commonAnswersWithUsers), Math.sqrt(Object.keys(asakaiChoices).length))
    }

    async getMBTIprofiles(requestUser: User) {
        const questions = await this.questionService.findByCategoryName('MBTI')
        const questionIdToIndexAndLetter: Record<number, MbtiIndexAndLetters> = {}
        questions.forEach((question) => {
            if (!(question.option1 in MBTI_INDEX_LETTERS_BY_OPTION_1)) {
                throw new Error(`L'option "${question.option1}" n'est pas valide`)
            }
            questionIdToIndexAndLetter[question.id] = MBTI_INDEX_LETTERS_BY_OPTION_1[
                question.option1
            ] as MbtiIndexAndLetters
        })

        const userAnswersBaseQueryBuilder = this.userToQuestionChoiceRepository
            .createQueryBuilder('user_to_question_choices')
            .where('user_to_question_choices.questionId IN (:...questionIds)', {
                questionIds: questions.map((question) => question.id),
            })

        if (requestUser?.company === THEODO_COMPANY) {
            userAnswersBaseQueryBuilder
                .leftJoin('user_to_question_choices.user', 'user')
                .andWhere('user.company = :theodoCompany', { theodoCompany: THEODO_COMPANY })
        }

        const usersAnswers = await userAnswersBaseQueryBuilder.getMany()

        const mbtiChoicesByUser: Record<number, [string | null, string | null, string | null, string | null]> = {}
        const usersHavingCompletedMbti: number[] = []
        let hasRequestUserCompletedMbti = false

        usersAnswers.forEach((userAnswer) => {
            if (!(userAnswer.userId in mbtiChoicesByUser)) {
                mbtiChoicesByUser[userAnswer.userId] = [null, null, null, null]
            }
            mbtiChoicesByUser[userAnswer.userId][questionIdToIndexAndLetter[userAnswer.questionId].index] =
                questionIdToIndexAndLetter[userAnswer.questionId][userAnswer.choice]
            if (mbtiChoicesByUser[userAnswer.userId].every((choice) => !!choice)) {
                usersHavingCompletedMbti.push(userAnswer.userId)
                if (userAnswer.userId === requestUser.id) {
                    hasRequestUserCompletedMbti = true
                }
            }
        })

        const usersWithPublicFields = await this.userService.findWithPublicFields(usersHavingCompletedMbti)
        const usersWithPublicFieldsByUserId: Record<number, UserWithPublicFields> = {}
        usersWithPublicFields.forEach((user) => {
            usersWithPublicFieldsByUserId[user.id] = { ...user }
        })

        const mbtiProfiles: Record<string, UserWithPublicFields[]> = {}

        for (const userId in mbtiChoicesByUser) {
            if (mbtiChoicesByUser[userId].includes(null)) {
                continue
            }
            const profile = mbtiChoicesByUser[userId].join('')
            if (profile in mbtiProfiles) {
                mbtiProfiles[profile].push(usersWithPublicFieldsByUserId[userId])
            } else {
                mbtiProfiles[profile] = [usersWithPublicFieldsByUserId[userId]]
            }
        }

        return { mbtiProfiles, hasRequestUserCompletedMbti }
    }
}
