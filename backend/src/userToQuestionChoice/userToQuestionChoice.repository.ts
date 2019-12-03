import { Repository, EntityRepository } from 'typeorm';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {
    async findByQuestionIds(questionIds): Promise<UserToQuestionChoice[]> {
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.company IN (:...companies)', { companies: ['theodo', 'gmail'] })
            .andWhere('user_to_question_choices.questionId IN (:...questionIds)', { questionIds })
            .getMany();
    }

    async findByValidatedQuestions(): Promise<UserToQuestionChoice[]> {
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.company IN (:...companies)', { companies: ['theodo', 'gmail'] })
            .leftJoin('user_to_question_choices.question', 'question')
            .where('question.isValidated = true OR question.isValidated IS NULL')
            .getMany();
    }
}
