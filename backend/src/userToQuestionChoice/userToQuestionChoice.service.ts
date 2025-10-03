import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DeepPartial } from 'typeorm'
import { CompanyDomain, UserWithPublicFields } from '../user/user.types'
import { User } from '../user/user.entity'
import { QuestionService } from '../question/question.service'
import { MBTI_INDEX_LETTERS_BY_OPTION_1, MbtiIndexAndLetters } from './constants'
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import {
    Alterodos,
    AsakaiEmailDTO,
    Choice,
    ChoicesByQuestion,
    QuestionFilters,
    QuestionPoll,
    SimilarityWithUserId,
    UserMap,
} from './userToQuestionChoice.types'

import { UserService } from '../user/user.service'
import { UserRepository } from '../user/user.repository'
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
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
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

    async getQuestionsPolls({ user, questionSetId }: { user: User; questionSetId?: number }) {
        const questionsPolls: Record<number, QuestionPoll> = {}
        let queryBuilder = this.userToQuestionChoiceRepository
            .createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')

        if (questionSetId) {
            queryBuilder = queryBuilder
                .leftJoin('user_to_question_choices.question', 'questions')
                .leftJoin('questions.questionSets', 'question_sets')
                .andWhere('question_sets.id = :questionSetId', { questionSetId })
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

    async findAsakaiAlterodos({ asakaiChoices, user }: { asakaiChoices: ChoicesByQuestion; user: User }) {
        const answeredQuestionsIds = Object.keys(asakaiChoices)
        if (answeredQuestionsIds.length === 0) {
            throw new BadRequestException('user must answer to at least one question')
        }

        const alterodos = await this.findAlterodosWithSameQuestions({ choicesByQuestion: asakaiChoices, user })

        return this.createAlterodosResponse(answeredQuestionsIds.length, alterodos)
    }

    async getUserAlterodos({ user }: { user: User }) {
        const allUserChoices = await this.userToQuestionChoiceRepository.find({ userId: user.id })

        const choicesByQuestion: ChoicesByQuestion = {}
        for (const questionChoice of allUserChoices) {
            choicesByQuestion[questionChoice.questionId] = questionChoice.choice
        }

        const alterodos = await this.findAlterodosWithSameQuestions({ choicesByQuestion, user })

        return this.createAlterodosResponse(allUserChoices.length, alterodos)
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

    async onNewAsakaiEmail({
        email,
        addedByUserId,
        asakaiChoices,
        alterodoUserId,
        varietoUserId,
        userLocale,
    }: AsakaiEmailDTO) {
        const createUserReponse = await this.userService.createUserWithEmail(email, addedByUserId, alterodoUserId)

        const asakaiVarietoUser = (await this.userRepository.findOne({ id: varietoUserId })) ?? null

        if (!createUserReponse) {
            return
        }
        const { newUser, addedByUser, asakaiAlterodoUser } = createUserReponse

        const choices: DeepPartial<UserToQuestionChoice>[] = []
        for (const questionId in asakaiChoices) {
            choices.push({ questionId: parseInt(questionId), choice: asakaiChoices[questionId], userId: newUser.id })
        }
        if (asakaiChoices) {
            await this.userToQuestionChoiceRepository.save(choices)
        }

        await this.userService.sendWelcomeEmail({ newUserEmail: newUser.email, userLocale })

        await this.userService.sendAlterodoLunchProposalEmail({
            newUserEmail: newUser.email,
            alterodoUser: asakaiAlterodoUser,
            varietoUser: asakaiVarietoUser,
            coachUserEmail: addedByUser?.email,
            userLocale,
        })
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

    private async findAlterodosWithSameQuestions({
        choicesByQuestion,
        user,
    }: {
        choicesByQuestion: ChoicesByQuestion
        user: User
    }): Promise<Alterodos> {
        const answeredQuestionsIds = Object.keys(choicesByQuestion)
        const commonAnswersWithUsers: { [id: number]: SimilarityWithUserId } = {}

        const userToQuestionChoices = await this.userToQuestionChoiceRepository.getOthersChoices(
            answeredQuestionsIds,
            user,
        )
        if (userToQuestionChoices.length === 0) {
            throw new BadRequestException({ code: 'NO_OTHER_USER_ANSWER' })
        }

        userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
            const isSameChoice = choicesByQuestion[userToQuestionChoice.questionId] === userToQuestionChoice.choice
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

        return getBestAlterodos(Object.values(commonAnswersWithUsers), Math.sqrt(answeredQuestionsIds.length))
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
            .leftJoin('user_to_question_choices.user', 'user')

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
