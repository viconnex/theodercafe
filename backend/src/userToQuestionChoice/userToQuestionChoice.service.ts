import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoice, AsakaiChoices, Alterodo } from './userToQuestionChoice.entity';
import { QuestionService } from '../question/question.service';
import { findAlterodoFromChoices } from './helpers/alterodoStrategies';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
        private readonly questionService: QuestionService,
    ) {}

    async saveChoice(questionId: number, userId: number, choice: number): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            userId,
            questionId,
        });

        if (!initialChoice) {
            this.questionService.updateQuestionChoicesCount(questionId, { 1: 0, 2: 0, [choice]: 1 });

            const newChoice = this.userToQuestionChoiceRepository.create({
                userId,
                questionId,
                choice,
            });

            return this.userToQuestionChoiceRepository.save(newChoice);
        }

        if (initialChoice && initialChoice.choice === choice) {
            return;
        }

        this.questionService.updateQuestionChoicesCount(questionId, {
            1: 0,
            2: 0,
            [initialChoice.choice]: -1,
            [choice]: 1,
        });

        initialChoice.choice = choice;

        return this.userToQuestionChoiceRepository.save(initialChoice);
    }

    async getAllUserChoices(userId: number): Promise<UserToQuestionChoice[]> {
        return await this.userToQuestionChoiceRepository.find({ userId });
    }

    async findAlterodo(asakaiChoices: AsakaiChoices): Promise<Alterodo> {
        const answeredQuestionsIds = Object.keys(asakaiChoices);
        if (answeredQuestionsIds.length === 0)
            throw new BadRequestException('user must answer to at least one question');

        return findAlterodoFromChoices(this.userToQuestionChoiceRepository, asakaiChoices);
    }
}
