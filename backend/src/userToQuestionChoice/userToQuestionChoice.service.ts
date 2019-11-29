import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { Question } from '../question/question.entity';
import { UserToQuestionChoice, AsakaiChoices, TotemSimilarity, Totem } from './userToQuestionChoice.entity';
import { In } from 'typeorm';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    ) {}

    async saveChoice(question: Question, userId: number, choice: number): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            userId,
            question,
        });
        if (initialChoice) {
            initialChoice.choice = choice;

            return this.userToQuestionChoiceRepository.save(initialChoice);
        }

        const newChoice = this.userToQuestionChoiceRepository.create({
            userId,
            question,
            choice,
        });

        return this.userToQuestionChoiceRepository.save(newChoice);
    }

    async getAllUserChoices(userId: number): Promise<UserToQuestionChoice[]> {
        return await this.userToQuestionChoiceRepository.find({ userId });
    }

    async findTotem(asakaiChoices: AsakaiChoices): Promise<Totem> {
        const answeredQuestionsIds = Object.keys(asakaiChoices);
        if (answeredQuestionsIds.length === 0)
            throw new BadRequestException('user must answer to at least one question');

        const asakaiNorm = Math.sqrt(answeredQuestionsIds.length);

        const userToQuestionChoices = await this.userToQuestionChoiceRepository.find({
            where: { questionId: In(answeredQuestionsIds) },
        });
        console.log(userToQuestionChoices);
        const totems: { [id: number]: TotemSimilarity } = {};

        userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
            const isSameChoice = asakaiChoices[userToQuestionChoice.questionId] === userToQuestionChoice.choice;
            const totemIncrement = {
                similarity: isSameChoice ? 1 : 0,
                sameAnswerCount: isSameChoice ? 1 : 0,
                squareNorm: 1,
            };
            if (!totems.hasOwnProperty(userToQuestionChoice.userId)) {
                totems[userToQuestionChoice.userId] = totemIncrement;
                return;
            }
            const currentTotem = totems[userToQuestionChoice.userId];
            totems[userToQuestionChoice.userId] = {
                similarity: currentTotem.similarity + totemIncrement.similarity,
                sameAnswerCount: currentTotem.sameAnswerCount + totemIncrement.sameAnswerCount,
                squareNorm: currentTotem.squareNorm + totemIncrement.squareNorm,
            };
        });
        let bestSimilarity = -1;
        let totemId = '0';
        for (const userId in totems) {
            const similarity = totems[userId].similarity / (Math.sqrt(totems[userId].squareNorm) * asakaiNorm);
            totems[userId].similarity = similarity;
            if (similarity > bestSimilarity) {
                totemId = userId;
                bestSimilarity = similarity;
            }
        }
        const totem = {
            user: { userId: parseInt(totemId) },
            similarity: totems[parseInt(totemId)],
        };

        return totem;
    }
}
