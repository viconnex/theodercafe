import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, In } from 'typeorm'
import { FormattedQuestionVote } from 'src/userToQuestionVote/types'
import { UserToQuestionVoteRepository } from './userToQuestionVote.repository'
import { UserToQuestionVote } from './userToQuestionVote.entity'

@Injectable()
export class UserToQuestionVoteService {
    constructor(
        @InjectRepository(UserToQuestionVoteRepository)
        private readonly userToQuestionVoteRepository: UserToQuestionVoteRepository,
    ) {}

    async saveVote(questionId: number, userId: number, isUpVote: boolean): Promise<UserToQuestionVote> {
        const initialVote = await this.userToQuestionVoteRepository.findOne({
            userId,
            questionId,
        })

        if (!initialVote) {
            return this.userToQuestionVoteRepository.save({
                userId,
                questionId,
                isUpVote,
            })
        }

        if (initialVote && initialVote.isUpVote === isUpVote) {
            return initialVote
        }

        initialVote.isUpVote = isUpVote

        return this.userToQuestionVoteRepository.save(initialVote)
    }

    async getAllUserVotes(userId: number): Promise<UserToQuestionVote[]> {
        return await this.userToQuestionVoteRepository.find({ userId })
    }

    async unVote(questionId: number, userId: number): Promise<DeleteResult> {
        return this.userToQuestionVoteRepository.delete({ userId, questionId })
    }

    async getQuestionsVotes(userId: number) {
        const questionVotesByQuestionId: Record<string, FormattedQuestionVote> = {}
        const questionVotes = await this.userToQuestionVoteRepository.getQuestionsVotes(userId)

        questionVotes.forEach((questionVote) => {
            questionVotesByQuestionId[questionVote.questionId] = {
                isUserUpVote: questionVote.isUserUpVote,
                upVoteCount: questionVote.upVoteCount ? parseInt(questionVote.upVoteCount) : 0,
                downVoteCount: questionVote.downVoteCount ? parseInt(questionVote.downVoteCount) : 0,
            }
        })

        return questionVotesByQuestionId
    }

    async getUserToQuestionVotesForQuestionIds(questionIds: number[]) {
        return this.userToQuestionVoteRepository.find({ questionId: In(questionIds) })
    }
}
