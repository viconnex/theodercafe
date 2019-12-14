import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionVoteRepository } from './userToQuestionVote.repository';
import { UserToQuestionVote } from './userToQuestionVote.entity';

import { DeleteResult } from 'typeorm';

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
        });

        if (!initialVote) {
            return this.userToQuestionVoteRepository.save({
                userId,
                questionId,
                isUpVote,
            });
        }

        if (initialVote && initialVote.isUpVote === isUpVote) {
            return;
        }

        initialVote.isUpVote = isUpVote;

        return this.userToQuestionVoteRepository.save(initialVote);
    }

    async getAllUserVotes(userId: number): Promise<UserToQuestionVote[]> {
        return await this.userToQuestionVoteRepository.find({ userId });
    }

    async unVote(questionId: number, userId: number): Promise<DeleteResult> {
        return this.userToQuestionVoteRepository.delete({ userId, questionId });
    }
}
